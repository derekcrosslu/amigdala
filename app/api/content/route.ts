// app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db/collections';

export async function GET(request: NextRequest) {
  try {
    const { content } = await getCollections();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      // Return specific section
      const sectionData = await content.findOne({ section });

      if (sectionData) {
        return NextResponse.json(sectionData);
      } else {
        return NextResponse.json(
          { error: `Section '${section}' not found` },
          { status: 404 }
        );
      }
    }

    // Return all sections
    const allSections = await content.find({}).toArray();
    return NextResponse.json(allSections);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await getCollections();
    const body = await request.json();

    // Validate request
    if (!body.section || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: 'section' and 'content'" },
        { status: 400 }
      );
    }

    // Add updatedAt timestamp
    const contentWithTimestamp = {
      ...body.content,
      updatedAt: new Date(),
    };

    // Update or insert content
    const result = await content.updateOne(
      { section: body.section },
      { $set: contentWithTimestamp },
      { upsert: true }
    );

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Section '${body.section}' updated successfully`,
      acknowledged: result.acknowledged,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
