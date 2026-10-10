import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';
import AdminOverviewClient from './AdminOverviewClient';

export const metadata = {
  title: 'Admin Dashboard | Mayur Arora CMS',
  description: 'Manage projects, skills, services, content, and inquiries.',
  robots: 'noindex, nofollow'
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session || !session.email) {
    redirect('/admin/login');
  }

  return <AdminOverviewClient />;
}
