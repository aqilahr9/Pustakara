import { simpanLogin } from '@/lib/server';

export async function POST() {
  return simpanLogin({ id: 0, name: 'Tamu', role: 'Guest' });
}