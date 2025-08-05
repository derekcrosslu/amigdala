import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export const config = {
  runtime: 'nodejs', // Explicitly set Node.js runtime (not Edge)
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    console.log('Delete request for media ID:', id);
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Media ID is required' });
    }
    
    const client = await clientPromise;
    const db = client.db();
    console.log('Connected to database');
    
    // Ensure ID is properly formatted for ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
      console.log('Valid ObjectId created:', objectId);
    } catch (err) {
      console.error('Invalid ObjectId format:', id, err);
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Find the media item first to get its file path
    const mediaItem = await db.collection('media').findOne({
      _id: objectId
    });
    
    console.log('Media item found:', mediaItem ? 'yes' : 'no');
    
    if (!mediaItem) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // Get the file path and try to delete the physical file
    const filePath = path.join(process.cwd(), 'public', mediaItem.path);
    
    try {
      // Check if file exists before trying to delete
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue with database deletion even if file deletion fails
    }
    
    // Delete the media item from the database
    const result = await db.collection('media').deleteOne({
      _id: objectId
    });
    
    console.log('Delete result:', result);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Failed to delete media' });
    }
    
    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting media:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
}
