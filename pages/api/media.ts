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
  // Add CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
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
      const { fields, files } = await parseForm(form, req).catch(err => {
        console.error('Form parsing error:', err);
        throw new Error(`Form parsing failed: ${err.message}`);
      });
      
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
      
      if (isProduction && process.env.BLOB_READ_WRITE_TOKEN) {
        // Production: Upload to Vercel Blob
        try {
          console.log('Uploading to Vercel Blob storage...');
          
          // Read file as buffer
          const fileBuffer = fs.readFileSync(fileObj.filepath);
          
          // Generate blob name
          const blobName = `uploads/${Date.now()}-${fileObj.originalFilename || 'image'}`;
          
          // Upload to Vercel Blob
          const blob = await put(blobName, fileBuffer, {
            access: 'public',
            addRandomSuffix: true,
            contentType: fileObj.mimetype,
          });
          
          fileUrl = blob.url;
          filePath = blob.url; // Use full URL as path in production
          console.log('Blob upload successful:', fileUrl);
          
          // Clean up temp file
          try {
            fs.unlinkSync(fileObj.filepath);
          } catch (e) {
            console.log('Could not delete temp file:', e);
          }
        } catch (blobError: any) {
          console.error('Blob upload error:', blobError);
          // Clean up temp file on error
          try {
            fs.unlinkSync(fileObj.filepath);
          } catch (e) {}
          throw new Error(`Blob upload failed: ${blobError.message}`);
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
        const client = await clientPromise;
        const db = client.db();
        const media = db.collection('media');
        const result = await media.insertOne(newItem);
        
        console.log('Saved to database:', result.insertedId);
        
        // Return success response
        res.status(200).json({ 
          ...newItem, 
          _id: result.insertedId,
          success: true 
        });
      } catch (dbError: any) {
        console.error('Database error:', dbError);
        // File was uploaded but DB save failed
        // Still return the file info but with a warning
        res.status(200).json({ 
          ...newItem,
          warning: 'File uploaded but database save failed',
          success: true
        });
      }
      
    } catch (error: any) {
      console.error('Upload handler error:', error);
      res.status(500).json({ 
        error: 'Image upload failed', 
        details: error.message || 'Unknown error',
        success: false
      });
    }
  } else if (req.method === 'GET') {
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
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
