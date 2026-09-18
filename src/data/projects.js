import goldenEarthImg from '../assets/golden-earth-school/assets/images/Gemini_Generated_Image_zc9rrazc9rrazc9r - Removed.png';
import hunarImg from '../assets/hunarproject/imgs/assets/hero-image.jpg';
import soloLevelingImg from '../assets/solo-leveling-todolist/solo-leveling-mockup.png';
import spotifyImg from '../assets/spotify files/images/Screenshot 3.png';

export const projectsData = [
  {
    id: 'golden-earth',
    title: 'Golden Earth School',
    description: 'A comprehensive, responsive school website featuring academics, admissions, gallery, and administrative sections with a modern UI.',
    category: 'Web Development',
    year: '2024',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    image: goldenEarthImg,
    liveUrl: '/src/assets/golden-earth-school/index.html',
    githubUrl: '#',
    featured: true
  },
  {
    id: 'hunar',
    title: 'Hunar Project',
    description: 'A beautiful educational platform showcasing courses like Full-Stack Development and Graphic Design, complete with modern animations.',
    category: 'Web Design',
    year: '2024',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    image: hunarImg,
    liveUrl: '/src/assets/hunarproject/hunarproject.html',
    githubUrl: '#',
    featured: true
  },
  {
    id: 'solo-leveling',
    title: 'Solo Leveling To-Do List',
    description: 'A React-based task management app inspired by the popular anime Solo Leveling, featuring a unique "System" interface and daily quests.',
    category: 'Web Application',
    year: '2024',
    technologies: ['React', 'Vite', 'CSS'],
    image: soloLevelingImg,
    liveUrl: '#',
    githubUrl: '#',
    featured: true
  },
  {
    id: 'spotify-clone',
    title: 'Spotify Clone',
    description: 'A pixel-perfect UI clone of the Spotify web player, complete with music player controls, playlists, and a sleek dark mode design.',
    category: 'Web Development',
    year: '2024',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    image: spotifyImg,
    liveUrl: '/src/assets/spotify files/index.html',
    githubUrl: '#',
    featured: true
  }
];
