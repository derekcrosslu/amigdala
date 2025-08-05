import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import clientPromise from '@/lib/db/mongodb';

export const config = {
  api: {
    bodyParser: false, // Disables Next.js body parsing to use formidable
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: false, uploadDir, keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }
      const fileObj = Array.isArray(file) ? file[0] : file;
      const filename = path.basename(fileObj.filepath);
      // Store the file path for database reference
      const filePath = `/uploads/${filename}`;
      // Create API-routed URL for client-side use
      // Use the new query-based API route for more reliable image serving
  const fileUrl = `/api/image?path=/uploads/${encodeURIComponent(filename)}`;
      const stats = fs.statSync(fileObj.filepath);
      const newItem = {
        name: fileObj.originalFilename || filename,
        path: filePath, // Original path for reference
        apiUrl: fileUrl, // API-routed URL for frontend use
        type: fileObj.mimetype || 'image',
        size: `${Math.round(stats.size / 1024)} KB`,
        uploaded: new Date(),
      };
      try {
        const client = await clientPromise;
        const db = client.db();
        const media = db.collection('media');
        const result = await media.insertOne(newItem);
        res.status(200).json({ ...newItem, _id: result.insertedId });
      } catch (dbErr) {
        console.error('DB error:', dbErr);
        res.status(500).json({ error: 'Failed to save media metadata' });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db();
      const media = db.collection('media');
      const items = await media.find({}).sort({ uploaded: -1 }).toArray();
      res.status(200).json(items);
    } catch (error) {
      console.error('DB error:', error);
      res.status(500).json({ error: 'Failed to fetch media' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
