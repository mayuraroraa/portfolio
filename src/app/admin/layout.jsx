import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'Admin Dashboard | Mayur Arora CMS',
  description: 'Manage projects, skills, services, content, and inquiries.',
  robots: 'noindex, nofollow'
};

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
