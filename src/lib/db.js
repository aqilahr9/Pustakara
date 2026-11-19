import pg from 'pg';

pg.types.setTypeParser(1082, (nilai) => nilai);
pg.types.setTypeParser(20, (nilai) => Number(nilai));
pg.types.setTypeParser(1700, (nilai) => Number(nilai));

if (!global.pgPool) {
  global.pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
}
export const pool = global.pgPool;

export function query(sql, params) {
  return pool.query(sql, params);
}

export const SQL_BUKU = `
  SELECT b.*, c.name AS cat,
         COALESCE(r.avg, 0) AS rating,
         COALESCE(r.n, 0) AS nrev
  FROM books b
  LEFT JOIN categories c ON c.id = b.category_id
  LEFT JOIN (
    SELECT book_id, ROUND(AVG(rating), 1) AS avg, COUNT(*) AS n
    FROM reviews
    GROUP BY book_id
  ) r ON r.book_id = b.id
`;

export const SQL_PEMINJAMAN = `
  SELECT l.*, b.title, b.cover_url, b.fine_per_day,
         u.name AS uname, u.nim,
         (CASE
            WHEN l.status = 'Sedang Dipinjam' AND l.due_date < CURRENT_DATE
            THEN (CURRENT_DATE - l.due_date) * b.fine_per_day
            ELSE 0
          END)::int AS run_fine,
         EXISTS(SELECT 1 FROM reviews r WHERE r.loan_id = l.id) AS reviewed
  FROM loans l
  JOIN books b ON b.id = l.book_id
  JOIN users u ON u.id = l.user_id
`;