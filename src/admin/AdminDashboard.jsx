import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  apiGetVideos, apiAddVideo, apiUpdateVideo, apiDeleteVideo,
  apiVerify, apiLogout, parseYouTubeUrl
} from './api';

const CATEGORIES = ['Wedding Teaser', 'Pre-Wedding Teaser', 'Showreel', 'Podcast'];
const emptyForm = { title: '', category: 'Wedding Teaser', description: '', youtube_url: '' };

// ── Helpers ──────────────────────────────────────────────────
const fmtSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const thumbSrc = (video) => {
  if (video.thumbnailPath) return video.thumbnailPath;
  const { thumbnailUrl } = parseYouTubeUrl(video.youtubeUrl);
  return thumbnailUrl;
};

// ── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value }) => (
  <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
    <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
    <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)", color: 'var(--color-text-muted)' }}>{label}</p>
  </div>
);

// ── File Drop Zone ────────────────────────────────────────────
const DropZone = ({ accept, label, file, onChange, icon }) => {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };

  return (
    <div
      className="rounded-xl border-2 border-dashed p-5 text-center transition-all cursor-pointer"
      style={{ borderColor: drag ? 'var(--color-accent-1)' : 'var(--color-border)', backgroundColor: drag ? 'rgba(200,241,53,0.04)' : 'transparent', cursor: 'pointer' }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files[0])} />
      <span className="text-2xl block mb-2">{icon}</span>
      {file ? (
        <>
          <p className="text-sm text-white font-medium truncate" style={{ fontFamily: "var(--font-heading)" }}>{file.name}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-accent-1)' }}>{fmtSize(file.size)}</p>
        </>
      ) : (
        <>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: "var(--font-body)" }}>{label}</p>
          <p className="text-xs mt-1" style={{ color: '#444' }}>Click or drag & drop</p>
        </>
      )}
    </div>
  );
};

// ── Progress Bar ─────────────────────────────────────────────
const ProgressBar = ({ progress }) => (
  <div className="mt-3 rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: '#1e1e1e' }}>
    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: 'var(--color-accent-1)' }} />
  </div>
);

// ── Video Modal ───────────────────────────────────────────────
const VideoModal = ({ video, onClose, onSaved }) => {
  const [form, setForm] = useState(video ? {
    title: video.title, category: video.category,
    description: video.description, youtube_url: video.youtubeUrl,
  } : emptyForm);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!video;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { thumbnailUrl: ytThumb } = parseYouTubeUrl(form.youtube_url);
  const previewThumb = thumbFile ? URL.createObjectURL(thumbFile) : (video?.thumbnailPath || ytThumb);

  const handleSave = async () => {
    if (!form.title || !form.category) { setError('Title and category are required.'); return; }
    setUploading(true);
    setError('');
    try {
      if (isEdit) {
        await apiUpdateVideo(video.id, form, videoFile, thumbFile, setProgress);
      } else {
        await apiAddVideo(form, videoFile, thumbFile, setProgress);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border text-sm text-white outline-none transition-all duration-300 focus:border-[var(--color-accent-1)]";
  const inputStyle = { fontFamily: "var(--font-body)", backgroundColor: '#0a0a0a', borderColor: 'var(--color-border)', cursor: 'text' };
  const labelClass = "text-[10px] uppercase tracking-[0.2em] mb-1.5 block";
  const labelStyle = { fontFamily: "var(--font-heading)", color: 'var(--color-text-muted)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', cursor: 'auto' }}>
      <div className="w-full max-w-xl rounded-2xl border overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-base font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{isEdit ? '✏️ Edit Video' : '➕ Add New Video'}</span>
          <button onClick={onClose} className="text-neutral-500 hover:text-white text-xl transition-colors" style={{ cursor: 'pointer' }}>✕</button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto">
          {/* Title */}
          <div>
            <label className={labelClass} style={labelStyle}>Title *</label>
            <input className={inputClass} style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Riya & Arjun — Wedding Teaser" />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass} style={labelStyle}>Category *</label>
            <select className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass} style={labelStyle}>Description</label>
            <textarea className={inputClass} style={inputStyle} rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description..." />
          </div>

          {/* YouTube URL */}
          <div>
            <label className={labelClass} style={labelStyle}>YouTube URL (optional)</label>
            <input className={inputClass} style={inputStyle} value={form.youtube_url} onChange={e => set('youtube_url', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: '#444', fontFamily: "var(--font-heading)" }}>or upload from PC</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>

          {/* File uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Video File</label>
              <DropZone
                icon="🎬"
                accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska"
                label="Upload MP4 / MOV / WebM"
                file={videoFile}
                onChange={setVideoFile}
              />
              {isEdit && video.videoPath && !videoFile && (
                <p className="text-[10px] mt-1.5" style={{ color: '#00F5D4' }}>Current: {video.videoPath.split('/').pop()}</p>
              )}
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Thumbnail Image</label>
              <DropZone
                icon="🖼️"
                accept="image/jpeg,image/png,image/webp"
                label="Upload JPG / PNG / WebP"
                file={thumbFile}
                onChange={setThumbFile}
              />
              {previewThumb && !thumbFile && (
                <img src={previewThumb} alt="thumb" className="mt-2 rounded-lg w-full aspect-video object-cover border" style={{ borderColor: 'var(--color-border)' }} />
              )}
              {thumbFile && (
                <img src={URL.createObjectURL(thumbFile)} alt="thumb" className="mt-2 rounded-lg w-full aspect-video object-cover border" style={{ borderColor: 'var(--color-accent-1)' }} />
              )}
            </div>
          </div>

          {/* Upload progress */}
          {uploading && (
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: "var(--font-body)" }}>Uploading… {progress}%</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {error && <p className="text-red-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>⚠️ {error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <button onClick={onClose} disabled={uploading} className="flex-1 py-3 rounded-lg border text-sm transition-all hover:border-neutral-500 disabled:opacity-40" style={{ fontFamily: "var(--font-heading)", borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={uploading} className="flex-1 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50" style={{ fontFamily: "var(--font-heading)", backgroundColor: 'var(--color-accent-1)', color: '#000', cursor: 'pointer' }}>
            {uploading ? `Uploading ${progress}%…` : isEdit ? 'Save Changes' : 'Add Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Video Row ─────────────────────────────────────────────────
const VideoRow = ({ video, onEdit, onDelete }) => {
  const thumb = thumbSrc(video);
  const { embedUrl } = parseYouTubeUrl(video.youtubeUrl);
  const hasVideo = video.videoPath || embedUrl;

  return (
    <div className="flex gap-4 items-center p-4 rounded-xl border transition-all hover:border-[var(--color-accent-1)] group" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      {/* Thumbnail */}
      <div className="shrink-0 w-28 h-16 rounded-lg overflow-hidden relative bg-[#0a0a0a]">
        {thumb ? <img src={thumb} alt={video.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>}
        {hasVideo && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-lg">▶</span></div>}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-widest block mb-0.5" style={{ fontFamily: "var(--font-heading)", color: 'var(--color-accent-1)' }}>{video.category}</span>
        <p className="text-sm font-medium text-white truncate" style={{ fontFamily: "var(--font-heading)" }}>{video.title}</p>
        {video.description && <p className="text-xs truncate mt-0.5" style={{ fontFamily: "var(--font-body)", color: 'var(--color-text-muted)' }}>{video.description}</p>}
        <div className="flex gap-3 mt-1">
          {video.youtubeUrl && <span className="text-[10px]" style={{ color: '#00F5D4' }}>YouTube ✓</span>}
          {video.videoPath && <span className="text-[10px]" style={{ color: 'var(--color-accent-1)' }}>File uploaded ✓</span>}
          {video.thumbnailPath && <span className="text-[10px]" style={{ color: '#888' }}>Custom thumb ✓</span>}
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <button onClick={() => onEdit(video)} style={{ cursor: 'pointer', fontFamily: "var(--font-heading)", borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} className="px-3 py-1.5 rounded-lg border text-xs transition-all hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]">Edit</button>
        <button onClick={() => onDelete(video.id)} style={{ cursor: 'pointer', fontFamily: "var(--font-heading)", borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} className="px-3 py-1.5 rounded-lg border text-xs transition-all hover:border-red-500 hover:text-red-400">Delete</button>
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────
const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [modal, setModal] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadVideos = async () => {
    try { setVideos(await apiGetVideos()); } catch { setVideos([]); }
    setLoading(false);
  };

  useEffect(() => {
    apiVerify().then(ok => {
      if (!ok) navigate('/admin');
      else loadVideos();
    });
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video? This cannot be undone.')) return;
    await apiDeleteVideo(id);
    loadVideos();
  };

  const handleLogout = () => { apiLogout(); navigate('/admin'); };

  const filtered = filterCat === 'All' ? videos : videos.filter(v => v.category === filterCat);
  const cats = { All: videos.length };
  CATEGORIES.forEach(c => { cats[c] = videos.filter(v => v.category === c).length; });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-dark)', cursor: 'auto' }}>
      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(5,5,5,0.95)', borderColor: 'var(--color-border)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>AS</span>
          <div>
            <span className="text-xs uppercase tracking-widest block" style={{ fontFamily: "var(--font-heading)", color: 'var(--color-accent-1)' }}>Admin</span>
            <span className="text-xs" style={{ fontFamily: "var(--font-body)", color: 'var(--color-text-muted)' }}>Video Manager</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" style={{ cursor: 'pointer', fontFamily: "var(--font-heading)", borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }} className="text-xs px-4 py-2 rounded-lg border transition-all hover:border-neutral-500">View Site</a>
          <button onClick={handleLogout} style={{ cursor: 'pointer', fontFamily: "var(--font-heading)" }} className="text-xs px-4 py-2 rounded-lg border border-red-900 text-red-400 hover:border-red-500 transition-all">Logout</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Videos" value={videos.length} />
          {CATEGORIES.map(c => <StatCard key={c} label={c} value={cats[c] || 0} />)}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-3xl text-white" style={{ fontFamily: "var(--font-display)" }}>Portfolio Videos</h1>
          <button onClick={() => setModal('add')} style={{ cursor: 'pointer', fontFamily: "var(--font-heading)", backgroundColor: 'var(--color-accent-1)', color: '#000' }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90">
            + Add Video
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)} style={{ cursor: 'pointer', fontFamily: "var(--font-heading)", borderColor: filterCat === c ? 'var(--color-accent-1)' : 'var(--color-border)', color: filterCat === c ? 'var(--color-accent-1)' : 'var(--color-text-muted)', backgroundColor: filterCat === c ? 'rgba(200,241,53,0.08)' : 'transparent' }} className="px-4 py-1.5 rounded-full text-xs border transition-all">
              {c} ({cats[c] || 0})
            </button>
          ))}
        </div>

        {/* Video list */}
        {loading ? (
          <div className="text-center py-20" style={{ color: 'var(--color-text-muted)' }}>Loading videos…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--color-text-muted)', fontFamily: "var(--font-body)" }}>
            <p className="text-4xl mb-3">🎬</p>
            <p>No videos yet. Click <strong>+ Add Video</strong> to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(v => <VideoRow key={v.id} video={v} onEdit={setModal} onDelete={handleDelete} />)}
          </div>
        )}
      </main>

      {modal && (
        <VideoModal
          video={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={loadVideos}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
