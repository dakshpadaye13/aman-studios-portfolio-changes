import React, { useState, useEffect } from 'react';
import { apiGetVideos, parseYouTubeUrl } from '../admin/api';

const filters = ['All', 'Wedding Teaser', 'Pre-Wedding Teaser', 'Showreel', 'Podcast'];

const VideoCard = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const { embedUrl, thumbnailUrl: ytThumb } = parseYouTubeUrl(video.youtubeUrl);
  const thumb = video.thumbnailPath || ytThumb;
  const localVideo = video.videoPath;

  const handleShare = () => {
    const url = video.youtubeUrl || window.location.href;
    if (navigator.share) navigator.share({ title: video.title, url });
    else { navigator.clipboard.writeText(url); alert('Link copied!'); }
  };

  const handleWatch = () => {
    if (embedUrl) setPlaying(true);
    else if (localVideo) setPlaying(true);
    else if (video.youtubeUrl) window.open(video.youtubeUrl, '_blank');
  };

  return (
    <div className="rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-1)] group" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="relative aspect-video overflow-hidden bg-[#0a0a0a]">
        {playing ? (
          embedUrl ? (
            <iframe src={`${embedUrl}?autoplay=1`} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={video.title} />
          ) : localVideo ? (
            <video src={localVideo} className="absolute inset-0 w-full h-full object-contain" controls autoPlay />
          ) : null
        ) : (
          <>
            {thumb ? (
              <img src={thumb} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1a1a1a,#0d0d0d)' }}>
                <span className="text-4xl opacity-30">🎬</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300" />
            <button onClick={handleWatch} className="absolute inset-0 flex items-center justify-center">
              <div className={`w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center transition-all duration-300 ${(embedUrl || localVideo) ? 'group-hover:bg-[var(--color-accent-1)] group-hover:border-[var(--color-accent-1)]' : 'opacity-30'}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white group-hover:text-black ml-0.5 transition-colors duration-300"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </button>
          </>
        )}
      </div>
      <div className="p-5">
        <span className="text-[10px] uppercase tracking-[0.2em] mb-2 block" style={{ fontFamily: "var(--font-heading)", color: 'var(--color-accent-1)' }}>{video.category}</span>
        <h3 className="text-base font-bold text-white mb-2 leading-snug" style={{ fontFamily: "var(--font-heading)" }}>{video.title}</h3>
        {video.description && <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: "var(--font-body)", color: 'var(--color-text-muted)' }}>{video.description}</p>}
        <div className="border-t pt-4 flex gap-3" style={{ borderColor: 'var(--color-border)' }}>
          <button onClick={handleWatch} className="flex-1 py-2.5 rounded-md border text-xs uppercase tracking-wider transition-all duration-300 hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]" style={{ fontFamily: "var(--font-heading)", borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>Watch</button>
          <button onClick={handleShare} className="flex-1 py-2.5 rounded-md border text-xs uppercase tracking-wider transition-all duration-300 hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]" style={{ fontFamily: "var(--font-heading)", borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>Share</button>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    apiGetVideos().then(setVideos).catch(() => setVideos([]));
  }, []);

  const filtered = activeFilter === 'All' ? videos : videos.filter(v => v.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 md:py-32 px-6 md:px-16 lg:px-24" style={{ background: 'linear-gradient(to bottom, rgba(8,11,20,0.85), rgba(13,16,32,0.92) 50%, rgba(8,11,20,0.88))' }}>
      <div className="max-w-7xl mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] mb-4 block" style={{ fontFamily: "var(--font-heading)", color: 'var(--color-accent-1)' }}>Portfolio</span>
        <h2 className="text-5xl md:text-6xl lg:text-7xl mb-10 leading-none" style={{ fontFamily: "var(--font-display)" }}>Featured<br />Work</h2>
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider border transition-all duration-300" style={{ fontFamily: "var(--font-heading)", borderColor: activeFilter === f ? 'var(--color-accent-1)' : 'var(--color-border)', color: activeFilter === f ? 'var(--color-accent-1)' : 'var(--color-text-muted)', backgroundColor: activeFilter === f ? 'rgba(200,241,53,0.08)' : 'transparent' }}>
              {f}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--color-text-muted)', fontFamily: "var(--font-body)" }}>
            <p className="text-4xl mb-3">🎬</p>
            <p>No videos yet — add some from the admin panel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
