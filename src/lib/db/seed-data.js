export const initialSeedData = {
  siteSettings: {
    siteTitle: 'Mayur Arora | Full-Stack Developer & Builder',
    siteDescription: '17-year-old full-stack developer building digital products, web applications, and AI experiences that are clear, robust, and highly functional.',
    publicContactEmail: 'mayuraroraa@gmail.com',
    heroRoleTitle: 'Full-Stack Developer',
    heroHeadline: 'MAYUR ARORA',
    heroBio: '17-year-old developer building digital products and AI experiences that are clear, robust, and highly functional.',
    aboutSubtitle: 'I build ideas from the interface to the infrastructure.',
    aboutBioParagraphs: [
      'I’m a young full-stack developer exploring technology, AI, creative digital experiences, and entrepreneurship.',
      'From writing interfaces and building backends to experimenting with AI and visual storytelling, I’m constantly turning things I learn into things I can actually build.',
      "The goal isn't to just become a developer. It’s to become a builder."
    ],
    socialLinks: {
      whatsapp: 'https://wa.me/+918360825752',
      email: 'mayuraroraa@gmail.com',
      instagram: 'https://www.instagram.com/mayurraroraa/',
      github: 'https://github.com',
    },
    appearance: {
      accentColor: '#A91520',
      accentBright: '#D92B35',
      cardBg: '#F5F5F3',
      defaultTheme: 'dark'
    },
    updatedAt: new Date()
  },
  projects: [
    {
      id: 'golden-earth',
      title: 'Golden Earth School',
      slug: 'golden-earth-school',
      shortDescription: 'A comprehensive, responsive school website featuring academics, admissions, gallery, and administrative sections with a modern UI.',
      description: 'Golden Earth School is a production-ready institutional platform designed for parents, teachers, and prospective students. It features multi-page academic overviews, responsive admission inquiry pipelines, photo galleries, and streamlined contact hubs with custom CSS transitions and responsive typography.',
      category: 'Web Development',
      year: '2024',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'UI/UX'],
      thumbnailUrl: '/assets/golden-earth-school/assets/images/Gemini_Generated_Image_zc9rrazc9rrazc9r - Removed.png',
      liveUrl: '/assets/golden-earth-school/index.html',
      githubUrl: 'https://github.com/mayurarora/golden-earth-school',
      featured: true,
      status: 'published',
      sortOrder: 1,
      createdAt: new Date('2024-02-15T00:00:00.000Z'),
      updatedAt: new Date('2024-02-15T00:00:00.000Z')
    },
    {
      id: 'hunar',
      title: 'Hunar Project',
      slug: 'hunar-project',
      shortDescription: 'A beautiful educational platform showcasing courses like Full-Stack Development and Graphic Design, complete with modern animations.',
      description: 'Hunar Project is an educational community portal engineered to provide hands-on vocational courses in software engineering and graphic design. The application implements fluid entrance animations, curriculum syllabi explorers, instructor profiles, and registration workflows.',
      category: 'Web Design',
      year: '2024',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'CSS Grid', 'Typography'],
      thumbnailUrl: '/assets/hunarproject/imgs/assets/hero-image.jpg',
      liveUrl: '/assets/hunarproject/hunarproject.html',
      githubUrl: 'https://github.com/mayurarora/hunar-project',
      featured: true,
      status: 'published',
      sortOrder: 2,
      createdAt: new Date('2024-03-10T00:00:00.000Z'),
      updatedAt: new Date('2024-03-10T00:00:00.000Z')
    },
    {
      id: 'solo-leveling',
      title: 'Solo Leveling To-Do List',
      slug: 'solo-leveling-todo',
      shortDescription: 'A React-based task management app inspired by the popular anime Solo Leveling, featuring a unique "System" interface and daily quests.',
      description: 'A gamified productivity suite that reimagines mundane task management as a character-leveling RPG. Users earn XP and rank up through Completed Dailies, featuring custom sound effects, dynamic quest penalities, state persistence in localStorage, and aesthetic inspired by the anime "Solo Leveling".',
      category: 'Web Application',
      year: '2024',
      technologies: ['React', 'Vite', 'CSS Modules', 'Web Audio API', 'State Management'],
      thumbnailUrl: '/assets/solo-leveling-todolist/solo-leveling-mockup.png',
      liveUrl: '/assets/solo-leveling-todolist/index.html',
      githubUrl: 'https://github.com/mayurarora/solo-leveling-todo',
      featured: true,
      status: 'published',
      sortOrder: 3,
      createdAt: new Date('2024-05-20T00:00:00.000Z'),
      updatedAt: new Date('2024-05-20T00:00:00.000Z')
    },
    {
      id: 'spotify-clone',
      title: 'Spotify Clone',
      slug: 'spotify-clone',
      shortDescription: 'A pixel-perfect UI clone of the Spotify web player, complete with music player controls, playlists, and a sleek dark mode design.',
      description: 'An interactive streaming interface replicating the desktop Spotify client. Built with custom media player controls, seek scrubbing, audio playback queues, interactive playlist grids, and smooth CSS transitions mimicking real-world streaming ergonomics.',
      category: 'Web Development',
      year: '2024',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Audio API', 'Dark Mode UI'],
      thumbnailUrl: '/assets/spotify files/images/Screenshot 3.png',
      liveUrl: '/assets/spotify files/index.html',
      githubUrl: 'https://github.com/mayurarora/spotify-clone',
      featured: true,
      status: 'published',
      sortOrder: 4,
      createdAt: new Date('2024-06-01T00:00:00.000Z'),
      updatedAt: new Date('2024-06-01T00:00:00.000Z')
    }
  ],
  services: [
    {
      id: 'full-stack',
      slug: 'full-stack-development',
      title: 'Full-Stack Development',
      description: 'I build modern, responsive web applications across the frontend and backend, focusing on clean interfaces, functional systems, APIs, databases, and practical digital products.',
      icon: 'Layers',
      featured: true,
      status: 'published',
      sortOrder: 1,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z')
    },
    {
      id: 'video-editing',
      slug: 'video-editing',
      title: 'Video Editing',
      description: 'I create engaging video edits for social media, personal brands, projects, and digital content with a focus on pacing, visuals, transitions, and storytelling.',
      icon: 'Video',
      featured: true,
      status: 'published',
      sortOrder: 2,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z')
    }
  ],
  skillCategories: [
    {
      id: 'frontend',
      name: 'Frontend Development',
      slug: 'frontend',
      description: 'Building responsive, accessible, high-performance user interfaces and interactive experiences.',
      sortOrder: 1,
      status: 'published'
    },
    {
      id: 'backend',
      name: 'Backend & APIs',
      slug: 'backend',
      description: 'Server architecture, RESTful API design, validation, authentication, and data pipelines.',
      sortOrder: 2,
      status: 'published'
    },
    {
      id: 'database',
      name: 'Database & Storage',
      slug: 'database',
      description: 'Schema modeling, query optimization, indexing, and persistent document storage.',
      sortOrder: 3,
      status: 'published'
    },
    {
      id: 'devops',
      name: 'Development & Workflow',
      slug: 'devops',
      description: 'Version control, automated deployments, CI/CD, and developer tooling.',
      sortOrder: 4,
      status: 'published'
    },
    {
      id: 'creative',
      name: 'Creative & Motion',
      slug: 'creative',
      description: 'Video storytelling, UI micro-interactions, animation choreography, and visual pacing.',
      sortOrder: 5,
      status: 'published'
    }
  ],
  skills: [
    { name: 'HTML5', categoryId: 'frontend', proficiencyLabel: 'Comfortable', sortOrder: 1, status: 'published' },
    { name: 'CSS3', categoryId: 'frontend', proficiencyLabel: 'Comfortable', sortOrder: 2, status: 'published' },
    { name: 'JavaScript (ES6+)', categoryId: 'frontend', proficiencyLabel: 'Comfortable', sortOrder: 3, status: 'published' },
    { name: 'React', categoryId: 'frontend', proficiencyLabel: 'Comfortable', sortOrder: 4, status: 'published' },
    { name: 'Next.js', categoryId: 'frontend', proficiencyLabel: 'Practicing', sortOrder: 5, status: 'published' },
    { name: 'Responsive Web Design', categoryId: 'frontend', proficiencyLabel: 'Comfortable', sortOrder: 6, status: 'published' },
    { name: 'Framer Motion', categoryId: 'frontend', proficiencyLabel: 'Practicing', sortOrder: 7, status: 'published' },
    
    { name: 'Node.js', categoryId: 'backend', proficiencyLabel: 'Comfortable', sortOrder: 1, status: 'published' },
    { name: 'Express.js', categoryId: 'backend', proficiencyLabel: 'Comfortable', sortOrder: 2, status: 'published' },
    { name: 'REST APIs', categoryId: 'backend', proficiencyLabel: 'Comfortable', sortOrder: 3, status: 'published' },
    { name: 'Authentication & JWT', categoryId: 'backend', proficiencyLabel: 'Practicing', sortOrder: 4, status: 'published' },
    { name: 'Server-Side Validation', categoryId: 'backend', proficiencyLabel: 'Practicing', sortOrder: 5, status: 'published' },
    
    { name: 'MongoDB', categoryId: 'database', proficiencyLabel: 'Comfortable', sortOrder: 1, status: 'published' },
    { name: 'MongoDB Atlas', categoryId: 'database', proficiencyLabel: 'Practicing', sortOrder: 2, status: 'published' },
    { name: 'SQL Basics', categoryId: 'database', proficiencyLabel: 'Learning', sortOrder: 3, status: 'published' },
    
    { name: 'Git', categoryId: 'devops', proficiencyLabel: 'Comfortable', sortOrder: 1, status: 'published' },
    { name: 'GitHub', categoryId: 'devops', proficiencyLabel: 'Comfortable', sortOrder: 2, status: 'published' },
    { name: 'Vercel Deployment', categoryId: 'devops', proficiencyLabel: 'Comfortable', sortOrder: 3, status: 'published' },
    
    { name: 'Video Editing', categoryId: 'creative', proficiencyLabel: 'Comfortable', sortOrder: 1, status: 'published' },
    { name: 'Visual Storytelling', categoryId: 'creative', proficiencyLabel: 'Comfortable', sortOrder: 2, status: 'published' },
    { name: 'UI Micro-Animations', categoryId: 'creative', proficiencyLabel: 'Practicing', sortOrder: 3, status: 'published' }
  ]
};
