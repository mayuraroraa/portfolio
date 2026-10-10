import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { getAllProjects } from '@/lib/db/repositories/projectsRepo';
import { getAllSkills, getAllCategories } from '@/lib/db/repositories/skillsRepo';
import { getAllServices } from '@/lib/db/repositories/servicesRepo';
import { getAllMessages } from '@/lib/db/repositories/messagesRepo';
import { getAllMedia } from '@/lib/db/repositories/mediaRepo';
import { getRecentAuditLogs } from '@/lib/db/repositories/auditRepo';
import { isMongoConnected } from '@/lib/db/mongodb';

export async function GET() {
  try {
    await requireAdminSession();

    const [projects, skills, categories, services, messages, media, logs, mongoActive] = await Promise.all([
      getAllProjects(),
      getAllSkills(),
      getAllCategories(),
      getAllServices(),
      getAllMessages(),
      getAllMedia(),
      getRecentAuditLogs(6),
      isMongoConnected()
    ]);

    const stats = {
      projects: {
        total: projects.length,
        published: projects.filter(p => p.status === 'published').length,
        drafts: projects.filter(p => p.status === 'draft').length
      },
      skills: {
        total: skills.length,
        categories: categories.length
      },
      services: {
        total: services.length,
        published: services.filter(s => s.status === 'published').length
      },
      messages: {
        total: messages.length,
        unread: messages.filter(m => m.status === 'unread').length
      },
      media: {
        total: media.length
      },
      recentLogs: logs,
      system: {
        database: mongoActive ? 'MongoDB Atlas (Connected)' : 'Local Resilient Fallback',
        nodeEnv: process.env.NODE_ENV || 'development',
        lastUpdated: new Date()
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Stats API] Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}
