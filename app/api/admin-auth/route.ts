import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db/collections';
import bcrypt from 'bcryptjs';
/**
 * POST /api/admin-auth
 * Body: { username: string, password: string }
 * Returns: { success: boolean, error?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { users } = await getCollections();
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
    }
    const user = await users.findOne({ username });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }
    // In production, issue a session/token here
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
