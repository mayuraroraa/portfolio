import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must match')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword']
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required').max(100),
  slug: z.string().min(2).max(100).optional(),
  shortDescription: z.string().min(10, 'Short description is required').max(300),
  description: z.string().min(20, 'Detailed description is required'),
  category: z.string().min(2, 'Category is required'),
  year: z.string().default(new Date().getFullYear().toString()),
  technologies: z.array(z.string()).min(1, 'At least one technology required'),
  thumbnailUrl: z.string().min(1, 'Thumbnail URL is required'),
  liveUrl: z.string().default('#'),
  githubUrl: z.string().default('#'),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
  sortOrder: z.coerce.number().default(1)
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(50),
  categoryId: z.string().min(1, 'Category is required'),
  proficiencyLabel: z.enum(['Learning', 'Practicing', 'Comfortable', 'Mastered']).default('Comfortable'),
  sortOrder: z.coerce.number().default(1),
  status: z.enum(['draft', 'published']).default('published')
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(50),
  slug: z.string().min(2).max(50).optional(),
  description: z.string().max(250).optional(),
  sortOrder: z.coerce.number().default(1),
  status: z.enum(['draft', 'published']).default('published')
});

export const serviceSchema = z.object({
  title: z.string().min(2, 'Service title is required').max(80),
  slug: z.string().min(2).max(80).optional(),
  description: z.string().min(10, 'Service description is required'),
  icon: z.string().default('Layers'),
  featured: z.boolean().default(true),
  sortOrder: z.coerce.number().default(1),
  status: z.enum(['draft', 'published']).default('published')
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Please enter a valid email address'),
  projectType: z.string().default('Not sure yet'),
  budget: z.string().default('Not sure yet'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000)
});

export const profileSettingsSchema = z.object({
  siteTitle: z.string().min(2).max(100),
  siteDescription: z.string().min(10).max(300),
  publicContactEmail: z.string().email(),
  heroRoleTitle: z.string().min(2).max(60),
  heroHeadline: z.string().min(2).max(60),
  heroBio: z.string().min(10).max(300),
  aboutSubtitle: z.string().min(5).max(120),
  aboutBioParagraphs: z.array(z.string()).min(1),
  socialLinks: z.object({
    whatsapp: z.string().optional(),
    email: z.string().optional(),
    instagram: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional()
  }),
  appearance: z.object({
    accentColor: z.string().default('#A91520'),
    accentBright: z.string().default('#D92B35'),
    cardBg: z.string().default('#F5F5F3'),
    defaultTheme: z.string().default('dark')
  }).optional()
});
