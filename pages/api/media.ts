import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import clientPromise from '@/lib/db/mongodb';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
  runtime: 'nodejs',
};

const isProduction = process.env.NODE_ENV === 'production';

// Promise-based wrapper for formidable
const parseForm = (form: any, req: NextApiRequest): Promise<{
  fields: any;
  files: any;
}> => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== API HANDLER STARTED ===');
  console.log('Request method:', req.method);
  console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
  console.log('Node version:', process.version);
  console.log('Vercel Blob package imported:', !!put);
  
  // Add CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Use switch statement to handle different HTTP methods
  switch (req.method) {
    case 'OPTIONS':
      return res.status(200).end();
      
    case 'POST':
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
        console.log('All BLOB env vars:', Object.keys(process.env).filter(k => k.includes('BLOB')));
        
        console.log('Starting file upload process...');
        
        // Configure formidable for serverless environment
        const formOptions = {
          multiples: false,
          // Always use /tmp in serverless environment
          uploadDir: '/tmp',
          keepExtensions: true,
          maxFileSize: 4.5 * 1024 * 1024, // 4.5MB limit
          filename: (name: any, ext: any, part: any, form: any) => {
            return `${Date.now()}-${Math.round(Math.random() * 1000)}${ext}`;
          },
          filter: (part: any) => {
            // Allow images only
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            return validTypes.includes(part.mimetype);
          },
        };
        
        // Create form instance
        const form = formidable(formOptions);
        
        // Parse the form
        console.log('=== PARSING FORM DATA ===');
        const { fields, files } = await parseForm(form, req).catch(err => {
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
        console.log('Files object:', JSON.stringify(files, null, 2));
        
        const file = files.file;
        if (!file) {
          console.error('No file in request');
          return res.status(400).json({ error: 'No file provided' });
        }
        
        const fileObj = Array.isArray(file) ? file[0] : file;
        console.log('File received:', {
          name: fileObj.originalFilename,
          size: fileObj.size,
          type: fileObj.mimetype
        });
        
        // Get file size before processing
        const fileSize = fileObj.size;
        
        let fileUrl = '';
        let filePath = '';
        
        // In production environment
        if (isProduction) {
          console.log('=== PRODUCTION ENVIRONMENT DETECTED ===');
          console.log('Blob token exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
          console.log('Blob token length:', process.env.BLOB_READ_WRITE_TOKEN?.length || 0);
          console.log('Blob token starts with:', process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 10) + '...');
          
          // Check if Blob storage is available
          if (process.env.BLOB_READ_WRITE_TOKEN) {
            // Production: Upload to Vercel Blob
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
              console.log('Blob pathname:', blob.pathname);
              console.log('Blob contentType:', blob.contentType);
              console.log('Blob contentDisposition:', blob.contentDisposition);
              console.log('Full blob object:', JSON.stringify(blob, null, 2));
              
              fileUrl = blob.url;
              filePath = blob.url; // Use full URL as path in production
              console.log('Blob upload successful! Final URL:', fileUrl);
              
              // Clean up temp file
              try {
                fs.unlinkSync(fileObj.filepath);
                console.log('Temp file cleaned up successfully');
              } catch (e) {
                console.log('Could not delete temp file:', e);
              }
            } catch (blobError: any) {
              console.error('=== BLOB UPLOAD ERROR ===');
              console.error('Error type:', blobError.constructor.name);
              console.error('Error message:', blobError.message);
              console.error('Error code:', blobError.code);
              console.error('Error status:', blobError.status);
              console.error('Error statusCode:', blobError.statusCode);
              console.error('Error response:', blobError.response);
              console.error('Full error object:', JSON.stringify(blobError, Object.getOwnPropertyNames(blobError), 2));
              console.error('Error stack:', blobError.stack);
              
              // Clean up temp file on error
              try {
                fs.unlinkSync(fileObj.filepath);
                console.log('Temp file cleaned up after error');
              } catch (e) {
                console.log('Could not delete temp file after error:', e);
              }
              throw new Error(`Blob upload failed: ${blobError.message || 'Unknown blob error'}`);
            }
          } else {
            // Production but no Blob token - fallback to local storage
            console.error('=== BLOB CONFIGURATION ERROR ===');
            console.error('Production environment but BLOB_READ_WRITE_TOKEN not set');
            console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('BLOB')));
            throw new Error('Blob storage not configured for production - BLOB_READ_WRITE_TOKEN missing');
          }
        } else {
          // Development: Save locally
          try {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            
            // Ensure upload directory exists
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
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
              fs.unlinkSync(fileObj.filepath);
            } catch (e) {
              console.log('Could not delete temp file:', e);
            }
          } catch (localError: any) {
            console.error('Local save error:', localError);
            // Clean up temp file on error
            try {
              fs.unlinkSync(fileObj.filepath);
            } catch (e) {}
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
            _id: result.insertedId,
            success: true 
          };
          console.log('=== SUCCESS RESPONSE ===');
          console.log(JSON.stringify(successResponse, null, 2));
          
          res.status(200).json(successResponse);
        } catch (dbError: any) {
          console.error('=== DATABASE ERROR ===');
          console.error('Error type:', dbError.constructor.name);
          console.error('Error message:', dbError.message);
          console.error('Error code:', dbError.code);
          console.error('Error codeName:', dbError.codeName);
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
          
          res.status(200).json(warningResponse);
        }
        
      } catch (error: any) {
        console.error('=== UPLOAD HANDLER CRITICAL ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        
        const errorResponse = { 
          error: 'Image upload failed', 
          details: error.message || 'Unknown error',
          errorType: error.constructor.name,
          environment: isProduction ? 'production' : 'development',
          blobConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
          mongoConfigured: !!process.env.MONGODB_URI,
          success: false
        };
        
        console.log('=== ERROR RESPONSE ===');
        console.log(JSON.stringify(errorResponse, null, 2));
        
        res.status(500).json(errorResponse);
      }
      break;
      
    case 'GET':
      try {
        const client = await clientPromise;
        const db = client.db();
        const media = db.collection('media');
        const items = await media.find({}).sort({ uploaded: -1 }).toArray();
        res.status(200).json(items);
      } catch (error: any) {
        console.error('Database fetch error:', error);
        res.status(500).json({ 
          error: 'Failed to fetch media', 
          details: error.message || 'Unknown error'
        });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}