import { UUID } from 'crypto';
import { cookies } from 'next/headers';

export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('session')?.value as UUID | undefined;
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}