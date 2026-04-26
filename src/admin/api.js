/**
 * api.js  — all calls to the Express backend at /api/*
 * (Vite proxies /api/* to http://localhost:3001)
 */

const BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api';

// ── Token helpers ──────────────────────────────────────────
export const getToken = () => sessionStorage.getItem('admin_token');
export const setToken = (t) => sessionStorage.setItem('admin_token', t);
export const clearToken = () => sessionStorage.removeItem('admin_token');

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// ── Auth ───────────────────────────────────────────────────
export const apiLogin = async (password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Incorrect password');
  const { token } = await res.json();
  setToken(token);
  return token;
};

export const apiVerify = async () => {
  try {
    const res = await fetch(`${BASE}/auth/verify`, { headers: authHeaders() });
    return res.ok;
  } catch { return false; }
};

export const apiLogout = () => clearToken();

// ── Videos ────────────────────────────────────────────────
export const apiGetVideos = async () => {
  const res = await fetch(`${BASE}/videos`);
  if (!res.ok) throw new Error('Failed to load videos');
  return res.json();
};

/**
 * Add a video. Supports both URL-only and file uploads.
 * @param {object} fields  - { title, category, description, youtube_url }
 * @param {File|null} videoFile - optional video file from input
 * @param {File|null} thumbFile - optional thumbnail file from input
 * @param {function} onProgress - progress callback (0-100)
 */
export const apiAddVideo = (fields, videoFile, thumbFile, onProgress) => {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => v && fd.append(k, v));
    if (videoFile) fd.append('video', videoFile);
    if (thumbFile) fd.append('thumbnail', thumbFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE}/videos`);
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.onload = () => {
      if (xhr.status === 201) resolve(JSON.parse(xhr.responseText));
      else reject(new Error(xhr.responseText));
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(fd);
  });
};

export const apiUpdateVideo = (id, fields, videoFile, thumbFile, onProgress) => {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v ?? ''));
    if (videoFile) fd.append('video', videoFile);
    if (thumbFile) fd.append('thumbnail', thumbFile);

    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `${BASE}/videos/${id}`);
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.onload = () => {
      if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
      else reject(new Error(xhr.responseText));
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(fd);
  });
};

export const apiDeleteVideo = async (id) => {
  const res = await fetch(`${BASE}/videos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Delete failed');
};

// ── YouTube URL parser (client-side, no API needed) ────────
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
