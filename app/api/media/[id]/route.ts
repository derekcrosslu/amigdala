import { NextRequest, NextResponse } from 'next/server';

// This is a reference to the same mock data store used in the parent route
// In a real app, this would be a database
let mediaItems = [
  { id: "1", name: "isotipo.webp", path: "/isotipo.webp", type: "image", size: "45 KB", uploaded: "2023-10-12" },
  { id: "2", name: "amigdala.webp", path: "/amigdala.webp", type: "image", size: "76 KB", uploaded: "2023-10-12" },
  { id: "3", name: "sol.webp", path: "/sol.webp", type: "image", size: "1.2 MB", uploaded: "2023-09-30" },
  { id: "4", name: "shadow-hands.jpeg", path: "/images/shadow-hands.jpeg", type: "image", size: "320 KB", uploaded: "2023-09-28" },
  { id: "5", name: "circle-artwork.jpeg", path: "/images/circle-artwork.jpeg", type: "image", size: "450 KB", uploaded: "2023-09-20" },
  { id: "6", name: "workshop-candle.jpeg", path: "/images/workshop-candle.jpeg", type: "image", size: "540 KB", uploaded: "2023-09-15" },
  { id: "7", name: "group-art-workshop.jpeg", path: "/images/group-art-workshop.jpeg", type: "image", size: "780 KB", uploaded: "2023-08-27" },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  const mediaItem = mediaItems.find(item => item.id === id);
  
  if (!mediaItem) {
    return NextResponse.json({ error: "Media item not found" }, { status: 404 });
  }
  
  return NextResponse.json(mediaItem);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  const initialLength = mediaItems.length;
  mediaItems = mediaItems.filter(item => item.id !== id);
  
  if (mediaItems.length === initialLength) {
    return NextResponse.json({ error: "Media item not found" }, { status: 404 });
  }
  
  return NextResponse.json({ success: true });
}
