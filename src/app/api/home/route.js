import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { errorDatabase } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const populer = await query(`
      SELECT b.*, c.name AS cat, COUNT(l.id) AS loans
      FROM books b
      LEFT JOIN categories c ON c.id = b.category_id
      LEFT JOIN loans l ON l.book_id = b.id AND l.status <> 'Ditolak'
      GROUP BY b.id, c.name
      ORDER BY loans DESC, b.title
      LIMIT 5
    `);

    const pengumuman = await query(`
      SELECT * FROM announcements
      WHERE status = 'Published'
      ORDER BY release_date DESC, id DESC
      LIMIT 3
    `);

    return NextResponse.json({
      top: populer.rows,
      anns: pengumuman.rows,
    });
  } catch (error) {
    return errorDatabase(error);
  }
}