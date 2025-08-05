import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import clientPromise from '@/lib/db/mongodb';

export const config = {
  api: {
    bodyParser: false, // Disables Next.js body parsing to use formidable
    responseLimit: false, // Remove response size limit
  },
  runtime: 'nodejs', // Explicitly set Node.js runtime (not Edge)
};

// Use /tmp for temporary files in Vercel serverless functions
// For local development, use the public/uploads directory
const isProduction = process.env.NODE_ENV === 'production';
const tmpDir = '/tmp';
const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');

// For formidable temporary file storage - use /tmp in production (Vercel)
const tempFileDir = isProduction ? tmpDir : publicUploadsDir;

// For final storage of files - always use public/uploads
const uploadDir = publicUploadsDir;

// Ensure directories exist
if (!fs.existsSync(tempFileDir)) {
  try {
    fs.mkdirSync(tempFileDir, { recursive: true });
    console.log(`Created temp directory: ${tempFileDir}`);
  } catch (err) {
    console.error(`Failed to create temp directory: ${tempFileDir}`, err);
  }
}

if (!fs.existsSync(uploadDir) && (!isProduction || uploadDir !== tempFileDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory: ${uploadDir}`);
  } catch (err) {
    console.error(`Failed to create upload directory: ${uploadDir}`, err);
  }
}

import type { IncomingForm } from 'formidable';

// Promise-based wrapper for formidable to use with async/await
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
  if (req.method === 'POST') {
    try {
      // Make sure the upload directory exists and is writable
      try {
        fs.accessSync(uploadDir, fs.constants.W_OK);
        console.log('Upload directory is writable:', uploadDir);
      } catch (accessError) {
        console.error('Upload directory is not writable:', uploadDir, accessError);
        // Try to create/fix the directory
        fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
        console.log('Created upload directory with explicit permissions');
      }
      
      // Configuration optimized for Vercel serverless functions
      const formOptions = {
        multiples: false,
        // Use /tmp for temporary file storage in production (Vercel)
        uploadDir: tempFileDir,
        keepExtensions: true,
        // Enforce 4.5MB limit for Vercel serverless functions (4.5MB = 4.5 * 1024 * 1024 bytes)
        maxFileSize: 4.5 * 1024 * 1024, 
        filename: (name: any, ext: any, part: any, form: any) => {
          // Generate a unique filename to avoid conflicts
          return `${Date.now()}-${Math.round(Math.random() * 1000)}${ext}`;
        },
        filter: (part: any) => {
          // Only allow certain file types
          return part.mimetype?.includes('image') || false;
        },
      };
      
      console.log('Upload attempt with options:', JSON.stringify(formOptions, null, 2));
      
      // Create the form instance
      const form = formidable(formOptions);
      
      // Use our promise-based wrapper
      const { fields, files } = await parseForm(form, req).catch(err => {
        console.error('Detailed form parsing error:', err);
        throw new Error(`Form parsing failed: ${err.message || 'Unknown error'}`);
      });
      
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }
      
      const fileObj = Array.isArray(file) ? file[0] : file;
      console.log('File received:', fileObj.originalFilename, 'Size:', fileObj.size);
      
      // Get the temporary filename
      let filename = path.basename(fileObj.filepath);
      console.log('Saved as temporary file:', filename, 'At path:', fileObj.filepath);
      
      // In production (Vercel), move from /tmp to the final destination
      if (isProduction && tempFileDir !== uploadDir) {
        try {
          // Create destination path
          const destPath = path.join(uploadDir, filename);
          console.log(`Moving file from ${fileObj.filepath} to ${destPath}`);
          
          // Copy the file from temp to final destination
          const fileContent = fs.readFileSync(fileObj.filepath);
          fs.writeFileSync(destPath, fileContent);
          
          // Remove temp file after successful copy
          fs.unlinkSync(fileObj.filepath);
          console.log('Successfully moved file to final destination');
        } catch (moveError: any) {
          console.error('Failed to move file to final destination:', moveError);
          return res.status(500).json({ 
            error: 'File move failed', 
            details: moveError.message || 'Unknown error' 
          });
        }
      }
      
      // Store the file path for database reference
      const filePath = `/uploads/${filename}`;
      
      // Create API-routed URL for client-side use
      const fileUrl = `/api/image?path=/uploads/${encodeURIComponent(filename)}`;
      
      // Verify the file exists in final location
      const finalFilePath = path.join(uploadDir, filename);
      if (!fs.existsSync(finalFilePath)) {
        console.error('File does not exist after processing:', finalFilePath);
        return res.status(500).json({ error: 'File save failed - not found in final location' });
      }
      
      const stats = fs.statSync(finalFilePath);
      const newItem = {
        name: fileObj.originalFilename || filename,
        path: filePath, // Original path for reference
        apiUrl: fileUrl, // API-routed URL for frontend use
        type: fileObj.mimetype || 'image',
        size: `${Math.round(stats.size / 1024)} KB`,
        uploaded: new Date(),
      };
      
      // Save to database
      const client = await clientPromise;
      const db = client.db();
      const media = db.collection('media');
      const result = await media.insertOne(newItem);
      
      console.log('Media saved to database with ID:', result.insertedId);
      res.status(200).json({ ...newItem, _id: result.insertedId });
      
    } catch (error: any) {
      console.error('Upload failed with error:', error);
      res.status(500).json({ 
        error: 'Image upload failed', 
        details: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
      console.error('DB error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch media', 
        details: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
