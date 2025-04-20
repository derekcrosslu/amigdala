// lib/db/collections.ts
import { Db } from 'mongodb';
import clientPromise from './mongodb';

export async function getCollections() {
  const client = await clientPromise;
  const db: Db = client.db('amigdala');

  return {
    content: db.collection('content'),
    media: db.collection('media'),
    settings: db.collection('settings'),
    users: db.collection('users'),
  };
}
