import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';

export const metadata = {
  title: 'Admin Access | Mayur Arora CMS',
  robots: 'noindex, nofollow'
};

/**
 * /admin is the dedicated entry point.
 * Checks server session:
 * - If valid session: redirects to /admin/dashboard
 * - If no session: redirects to /admin/login
 */
export default async function AdminEntryPointPage() {
  const session = await getAdminSession();
  if (!session || !session.email) {
    redirect('/admin/login');
  }

  redirect('/admin/dashboard');
}
