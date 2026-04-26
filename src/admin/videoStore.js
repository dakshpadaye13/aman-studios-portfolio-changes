/**
 * videoStore.js
 * Shared data layer — reads/writes to localStorage.
 * Both Portfolio (public) and Admin dashboard use this.
 */

const STORAGE_KEY = 'aman_portfolio_videos';

const DEFAULT_VIDEOS = [
  {
    id: '1',
    category: 'Wedding Teaser',
    title: 'Riya & Arjun — A Love Story',
    description: 'An emotional cinematic wedding teaser capturing the magic of their special day in the hills of Lonavala.',
    youtubeUrl: '',
    thumbnailUrl: '',
    createdAt: new Date('2024-12-01').toISOString(),
  },
  {
    id: '2',
    category: 'Pre-Wedding Teaser',
    title: 'Sneha & Vikram — Before Forever',
    description: 'A romantic pre-wedding film shot at the stunning forts and beaches of Goa.',
    youtubeUrl: '',
    thumbnailUrl: '',
    createdAt: new Date('2024-11-15').toISOString(),
  },
  {
    id: '3',
    category: 'Showreel',
    title: '2024 Showreel — Best of the Year',
    description: 'A high-energy compilation reel showcasing the best cinematic moments from 2024 projects.',
    youtubeUrl: '',
    thumbnailUrl: '',
    createdAt: new Date('2024-11-01').toISOString(),
  },
  {
    id: '4',
    category: 'Podcast',
    title: 'The Creator Mindset Ep. 12',
    description: 'Clean multi-cam podcast edit with custom graphics, captions, and balanced audio.',
    youtubeUrl: '',
    thumbnailUrl: '',
    createdAt: new Date('2024-10-20').toISOString(),
  },
];

export const getVideos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VIDEOS));
      return DEFAULT_VIDEOS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_VIDEOS;
  }
};

export const saveVideos = (videos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
};

export const addVideo = (video) => {
  const videos = getVideos();
  const newVideo = {
    ...video,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  videos.unshift(newVideo);
  saveVideos(videos);
  return newVideo;
};

export const updateVideo = (id, updates) => {
  const videos = getVideos();
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  videos[idx] = { ...videos[idx], ...updates };
  saveVideos(videos);
  return videos[idx];
};

export const deleteVideo = (id) => {
  const videos = getVideos().filter((v) => v.id !== id);
  saveVideos(videos);
};

/** Extract YouTube embed URL & thumbnail from various YouTube URL formats */
export const parseYouTubeUrl = (url) => {
  if (!url) return { embedUrl: '', thumbnailUrl: '' };
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  if (!match) return { embedUrl: '', thumbnailUrl: '' };
  const id = match[1];
  return {
    embedUrl: `https://www.youtube.com/embed/${id}`,
    thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
  };
};

// Admin auth (simple password protection — client-side only)
const AUTH_KEY = 'aman_admin_auth';
const ADMIN_PASSWORD = 'aman@admin2025'; // change as needed

export const adminLogin = (password) => {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const adminLogout = () => sessionStorage.removeItem(AUTH_KEY);

export const isAdminLoggedIn = () => sessionStorage.getItem(AUTH_KEY) === 'true';
