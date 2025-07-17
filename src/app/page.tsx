
import { getSession } from '@/auth/session'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  redirect('/dashboard');
}
