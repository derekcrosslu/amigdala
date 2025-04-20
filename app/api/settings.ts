import { NextApiRequest, NextApiResponse } from 'next';
import { getCollections } from '@/lib/db/collections';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { settings } = await getCollections();

  if (req.method === 'GET') {
    const data = await settings.findOne({});
    res.status(200).json(data || {});
    return;
  }

  if (req.method === 'POST') {
    const newSettings = req.body;
    await settings.updateOne({}, { $set: newSettings }, { upsert: true });
    res.status(200).json({ success: true });
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
