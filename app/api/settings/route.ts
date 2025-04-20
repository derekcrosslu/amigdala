import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db/collections';

export async function GET() {
  const { settings } = await getCollections();
  const data = await settings.findOne({});
  return NextResponse.json(data || {});
}

export async function POST(request: NextRequest) {
  try {
    const { settings } = await getCollections();
    const newSettings = await request.json();
    // Remove _id if present
    if ('_id' in newSettings) {
      delete newSettings._id;
    }
    await settings.updateOne({}, { $set: newSettings }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
