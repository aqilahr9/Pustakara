import { NextResponse } from 'next/server';
import { getUser } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ user: getUser() });
}