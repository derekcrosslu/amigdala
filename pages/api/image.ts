import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    responseLimit: false, // Remove the response size limit
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { path: imagePath } = req.query;
  
  if (!imagePath || typeof imagePath !== 'string') {
    return res.status(400).json({ error: 'Image path is required' });
  }
  
  // Handle double-encoded URLs
  let decodedPath = imagePath;
  // Try to decode the path if it's encoded
  try {
    if (decodedPath.includes('%2F')) {
      decodedPath = decodeURIComponent(decodedPath);
    }
  } catch (e) {
    console.error('Error decoding path:', e);
  }
  
  // Security check: only allow access to files in the uploads directory
  // Also normalize path to ensure it starts with /uploads/
  if (!decodedPath.includes('uploads')) {
    return res.status(403).json({ error: 'Access denied: Path must include uploads directory' });
  }
  
  // Extract the filename from the path - ensure we're only accessing the uploads folder
  const pathParts = decodedPath.split('uploads/');
  if (pathParts.length < 2) {
    return res.status(403).json({ error: 'Access denied: Invalid path format' });
  }
  
  const filename = pathParts[pathParts.length - 1];
  const normalizedPath = `/uploads/${filename}`;
  
  const filePath = path.join(process.cwd(), 'public', normalizedPath);
  
  // Log request info for debugging
  console.log('API Request:', {
    query: req.query,
    imagePath,
    fullPath: filePath,
    exists: fs.existsSync(filePath)
  });

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `File not found: ${filePath}` });
    }
    
    // Determine content type
    const ext = path.extname(imagePath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    
    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Read and send file
    const fileBuffer = fs.readFileSync(filePath);
    res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
}
