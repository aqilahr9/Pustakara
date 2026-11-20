import { NextResponse } from 'next/server';

export async function POST() {
  const respon = NextResponse.json({});
  respon.cookies.delete('t');
  return respon;
}