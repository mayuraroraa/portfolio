import { getPublishedProjects } from '@/lib/db/repositories/projectsRepo';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mayurarora.dev';

  const staticRoutes = [
    '',
    '/work',
    '/skills',
    '/services',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const projects = await getPublishedProjects();
    const projectRoutes = projects.map((p) => ({
      url: `${baseUrl}/project/${p.slug || p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}
