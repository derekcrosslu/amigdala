import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// Try importing Vercel Blob - with error handling
let put: ((pathname: string, body: Buffer | ReadableStream | string, options?: any) => Promise<any>) | undefined;
try {
  const blobModule = require('@vercel/blob');
  put = blobModule.put;
  console.log('Vercel Blob module loaded successfully');
} catch (error) {
  console.error('Failed to load @vercel/blob:', error);
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
  runtime: 'nodejs',
};

const isProduction = process.env.NODE_ENV === 'production';

// Type definitions for formidable parsed data
interface ParsedForm {
  fields: Fields;
  files: Files;
}

// Promise-based wrapper for formidable with proper typing
const parseForm = (req: NextApiRequest): Promise<ParsedForm> => {
  const formOptions: formidable.Options = {
    multiples: false,
    uploadDir: '/tmp',
    keepExtensions: true,
    maxFileSize: 4.5 * 1024 * 1024, // 4.5MB limit
    filename: (_name: string, ext: string) => {
      return `${Date.now()}-${Math.round(Math.random() * 1000)}${ext}`;
    },
    filter: (part) => {
      // Allow images only
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      return part.mimetype ? validTypes.includes(part.mimetype) : false;
    },
  };

  const form = formidable(formOptions);

  return new Promise((resolve, reject) => {
    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

// Helper function to get file from formidable files object
const getFileFromFiles = (files: Files): File | null => {
  const file = files.file;
  if (!file) return null;
  
  if (Array.isArray(file)) {
    return file[0] || null;
  }
  return file;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== API HANDLER STARTED ===');
  console.log('Request method:', req.method);
  console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
  console.log('Node version:', process.version);
  console.log('Vercel Blob put function available:', !!put);
  
  // Check if @vercel/blob is properly installed
  try {
    require.resolve('@vercel/blob');
    console.log('@vercel/blob package found in node_modules');
  } catch (e) {
    console.error('@vercel/blob package NOT found:', e);
  }
  
  // Add CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Use switch statement to handle different HTTP methods
  switch (req.method) {
    case 'OPTIONS':
      return res.status(200).end();
      
    case 'POST':
      let tempFilePath: string | undefined;
      
      try {
        console.log('=== POST REQUEST HANDLER ===');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Content-Length:', req.headers['content-length']);
        
        // Check environment configuration
        console.log('=== ENVIRONMENT CHECK ===');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
        console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
        
        console.log('Starting file upload process...');
        
        // Parse the form
        console.log('=== PARSING FORM DATA ===');
        const { fields, files } = await parseForm(req).catch(err => {
          console.error('Form parsing error details:', {
            message: err.message,
            code: err.code,
            httpCode: err.httpCode,
            stack: err.stack
          });
          throw new Error(`Form parsing failed: ${err.message}`);
        });
        
        console.log('Form parsed successfully');
        console.log('Fields received:', Object.keys(fields || {}));
        console.log('Files received:', Object.keys(files || {}));
        
        const fileObj = getFileFromFiles(files);
        if (!fileObj) {
          console.error('No file in request');
          return res.status(400).json({ error: 'No file provided' });
        }
        
        tempFilePath = fileObj.filepath; // Store for cleanup
        
        console.log('File received:', {
          name: fileObj.originalFilename,
          size: fileObj.size,
          type: fileObj.mimetype
        });
        
        // Get file size before processing
        const fileSize = fileObj.size || 0;
        
        let fileUrl = '';
        let filePath = '';
        
        // In production environment
        if (isProduction && process.env.BLOB_READ_WRITE_TOKEN && put) {
          console.log('=== PRODUCTION ENVIRONMENT WITH BLOB DETECTED ===');
          console.log('Blob token exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
          console.log('Put function available:', !!put);
          
          try {
            console.log('=== STARTING VERCEL BLOB UPLOAD ===');
            console.log('File path to read:', fileObj.filepath);
            console.log('File exists:', fs.existsSync(fileObj.filepath));
            
            // Read file as buffer
            const fileBuffer = fs.readFileSync(fileObj.filepath);
            console.log('File buffer created, size:', fileBuffer.length, 'bytes');
            
            // Generate blob name
            const cleanFilename = (fileObj.originalFilename || 'image').replace(/[^a-zA-Z0-9.-]/g, '_');
            const blobName = `uploads/${Date.now()}-${cleanFilename}`;
            console.log('Blob name generated:', blobName);
            
            // Prepare upload options
            const uploadOptions = {
              access: 'public' as const,
              addRandomSuffix: true,
              contentType: fileObj.mimetype || 'application/octet-stream',
            };
            console.log('Upload options:', JSON.stringify(uploadOptions, null, 2));
            
            console.log('Calling Vercel Blob put() function...');
            
            // Upload to Vercel Blob
            const blob = await put(blobName, fileBuffer, uploadOptions);
            
            console.log('=== BLOB UPLOAD RESPONSE ===');
            console.log('Blob URL:', blob.url);
            console.log('Full blob object:', JSON.stringify(blob, null, 2));
            
            fileUrl = blob.url;
            filePath = blob.url; // Use full URL as path in production
            console.log('Blob upload successful! Final URL:', fileUrl);
            
            // Clean up temp file
            try {
              if (fs.existsSync(fileObj.filepath)) {
                fs.unlinkSync(fileObj.filepath);
                console.log('Temp file cleaned up successfully');
              }
            } catch (e) {
              console.log('Could not delete temp file:', e);
            }
          } catch (blobError: any) {
            console.error('=== BLOB UPLOAD ERROR ===');
            console.error('Error type:', blobError.constructor?.name);
            console.error('Error message:', blobError.message);
            console.error('Full error object:', JSON.stringify(blobError, Object.getOwnPropertyNames(blobError), 2));
            console.error('Error stack:', blobError.stack);
            
            // Clean up temp file on error
            try {
              if (fs.existsSync(fileObj.filepath)) {
                fs.unlinkSync(fileObj.filepath);
                console.log('Temp file cleaned up after error');
              }
            } catch (e) {
              console.log('Could not delete temp file after error:', e);
            }
            throw new Error(`Blob upload failed: ${blobError.message || 'Unknown blob error'}`);
          }
        } else if (isProduction) {
          // Production but no Blob token - error
          console.error('=== BLOB CONFIGURATION ERROR ===');
          console.error('Production environment but BLOB_READ_WRITE_TOKEN not set or put function not available');
          throw new Error('Blob storage not configured for production - BLOB_READ_WRITE_TOKEN missing or @vercel/blob not installed');
        } else {
          // Development: Save locally
          try {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            
            // Ensure upload directory exists
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
              console.log('Created upload directory:', uploadDir);
            }
            
            // Generate filename
            const filename = `${Date.now()}-${fileObj.originalFilename || 'image'}`;
            const destPath = path.join(uploadDir, filename);
            
            // Copy file from temp to public/uploads
            const fileData = fs.readFileSync(fileObj.filepath);
            fs.writeFileSync(destPath, fileData);
            
            filePath = `/uploads/${filename}`;
            fileUrl = filePath;
            
            console.log('Local file saved:', destPath);
            
            // Clean up temp file
            try {
              if (fs.existsSync(fileObj.filepath)) {
                fs.unlinkSync(fileObj.filepath);
                console.log('Temp file cleaned up');
              }
            } catch (e) {
              console.log('Could not delete temp file:', e);
            }
          } catch (localError: any) {
            console.error('Local save error:', localError);
            // Clean up temp file on error
            try {
              if (fs.existsSync(fileObj.filepath)) {
                fs.unlinkSync(fileObj.filepath);
              }
            } catch (e) {
              console.log('Could not delete temp file:', e);
            }
            throw new Error(`Local save failed: ${localError.message}`);
          }
        }
        
        // Create database entry
        const newItem = {
          name: fileObj.originalFilename || 'unnamed',
          path: filePath,
          apiUrl: fileUrl, // Direct URL to the file
          type: fileObj.mimetype || 'image',
          size: `${Math.round(fileSize / 1024)} KB`,
          uploaded: new Date(),
        };
        
        // Save to MongoDB
        try {
          console.log('=== MONGODB SAVE ===');
          console.log('Attempting to connect to MongoDB...');
          const client = await clientPromise;
          console.log('MongoDB client connected');
          
          const db = client.db();
          console.log('Database selected');
          
          const media = db.collection('media');
          console.log('Media collection selected');
          
          console.log('Inserting document:', JSON.stringify(newItem, null, 2));
          const result = await media.insertOne(newItem);
          
          console.log('MongoDB save successful!');
          console.log('Inserted ID:', result.insertedId);
          
          // Return success response
          const successResponse = { 
            ...newItem, 
            _id: result.insertedId.toString(),
            success: true 
          };
          console.log('=== SUCCESS RESPONSE ===');
          console.log(JSON.stringify(successResponse, null, 2));
          
          return res.status(200).json(successResponse);
        } catch (dbError: any) {
          console.error('=== DATABASE ERROR ===');
          console.error('Error type:', dbError.constructor?.name);
          console.error('Error message:', dbError.message);
          console.error('Full error:', JSON.stringify(dbError, Object.getOwnPropertyNames(dbError), 2));
          
          // File was uploaded but DB save failed
          // Still return the file info but with a warning
          const warningResponse = { 
            ...newItem,
            warning: 'File uploaded but database save failed',
            dbError: dbError.message,
            success: true
          };
          console.log('=== WARNING RESPONSE (DB failed but file uploaded) ===');
          console.log(JSON.stringify(warningResponse, null, 2));
          
          return res.status(200).json(warningResponse);
        }
        
      } catch (error: any) {
        console.error('=== UPLOAD HANDLER CRITICAL ERROR ===');
        console.error('Error type:', error.constructor?.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        
        // Clean up temp file if it exists
        if (tempFilePath) {
          try {
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
              console.log('Temp file cleaned up after error');
            }
          } catch (cleanupError) {
            console.log('Could not clean up temp file:', cleanupError);
          }
        }
        
        const errorResponse = { 
          error: 'Image upload failed', 
          details: error.message || 'Unknown error',
          errorType: error.constructor?.name || 'UnknownError',
          environment: isProduction ? 'production' : 'development',
          blobConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
          mongoConfigured: !!process.env.MONGODB_URI,
          success: false
        };
        
        console.log('=== ERROR RESPONSE ===');
        console.log(JSON.stringify(errorResponse, null, 2));
        
        return res.status(500).json(errorResponse);
      }
      break;
      
    case 'GET':
      try {
        const client = await clientPromise;
        const db = client.db();
        const media = db.collection('media');
        const items = await media.find({}).sort({ uploaded: -1 }).toArray();
        return res.status(200).json(items);
      } catch (error: any) {
        console.error('Database fetch error:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch media', 
          details: error.message || 'Unknown error'
        });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}