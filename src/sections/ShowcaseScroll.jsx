import React, { useEffect, useRef } from 'react';

const ShowcaseScroll = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!section || !card) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress: 0 = section just entered view top, 1 = section center at viewport center
      const rawProgress = 1 - rect.top / windowHeight;
      const progress = Math.max(0, Math.min(1, rawProgress));

      // At progress=0: tilted away (rotateX 30deg, scale 0.85, translateY -30px)
      // At progress=1: flat (rotateX 0, scale 1, translateY 0)
      const rotateX = 30 * (1 - progress);
      const scale = 0.82 + 0.18 * progress;
      const translateY = -40 * (1 - progress);
      const opacity = 0.3 + 0.7 * progress;

      // Perspective origin shift — starts from slightly above, comes to center
      card.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        scale(${scale})
        translateY(${translateY}px)
      `;
      card.style.opacity = opacity;

      // Glow intensifies as it comes forward
      if (glow) {
        glow.style.opacity = progress * 0.7;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-dark)',
        perspective: '1200px',
        perspectiveOrigin: '50% 0%',
      }}
    >
      {/* Top label */}
      <div className="text-center mb-14">
        <span
          className="text-xs uppercase tracking-[0.3em] mb-3 block"
          style={{ fontFamily: "var(--font-heading)", color: 'var(--color-accent-1)' }}
        >
          Editing Suite
        </span>
        <h2
          className="text-4xl md:text-6xl lg:text-7xl leading-none text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Where Stories
          <br />
          Come Alive
        </h2>
        <p
          className="mt-5 text-sm md:text-base max-w-md mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: 'var(--color-text-muted)' }}
        >
          Inside the edit — where raw footage transforms into cinematic masterpieces.
        </p>
      </div>

      {/* 3D tilting card wrapper */}
      <div className="relative max-w-5xl mx-auto" style={{ transformStyle: 'preserve-3d' }}>
        {/* Neon glow behind card */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(200,241,53,0.25) 0%, rgba(0,245,212,0.1) 40%, transparent 70%)',
            filter: 'blur(40px)',
            transform: 'scale(1.1)',
            zIndex: 0,
            opacity: 0,
          }}
        />

        {/* The 3D card itself */}
        <div
          ref={cardRef}
          className="relative rounded-2xl overflow-hidden border"
          style={{
            borderColor: 'rgba(200,241,53,0.15)',
            backgroundColor: 'var(--color-surface)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            opacity: 0.3,
            transform: 'perspective(900px) rotateX(30deg) scale(0.82) translateY(-40px)',
            boxShadow:
              '0 50px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,241,53,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Fake editing software UI */}
          <EditorUI />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg-dark)]" />
    </section>
  );
};

/* ──── Fake Premiere Pro-style Editor UI ──── */
const EditorUI = () => {
  const tracks = [
    { color: '#C8F135', label: 'V1 — Wedding Teaser 4K', width: '65%' },
    { color: '#00F5D4', label: 'V2 — Color Grade', width: '45%' },
    { color: '#FF6B6B', label: 'A1 — Ambient Music', width: '80%' },
    { color: '#888', label: 'A2 — Vows Audio', width: '55%' },
  ];

  return (
    <div className="w-full" style={{ backgroundColor: '#0d0d0d', fontFamily: "var(--font-body)" }}>
      {/* Menubar */}
      <div
        className="flex items-center gap-4 px-4 py-2.5 border-b"
        style={{ backgroundColor: '#111', borderColor: '#1e1e1e' }}
      >
        {/* Traffic light dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
          <span className="w-3 h-3 rounded-full opacity-80" style={{ backgroundColor: '#C8F135' }} />
        </div>
        <span className="text-xs text-neutral-500">AS_Wedding_Riya_Arjun_4K.prproj — Adobe Premiere Pro</span>
        <div className="flex items-center gap-3 ml-auto">
          {['File', 'Edit', 'Clip', 'Sequence', 'Effect', 'Window', 'Help'].map((m) => (
            <span key={m} className="text-[11px] text-neutral-400 hover:text-white cursor-default">{m}</span>
          ))}
        </div>
      </div>

      {/* Main panels */}
      <div className="flex" style={{ height: '420px' }}>
        {/* Left — Source monitor */}
        <div
          className="flex flex-col border-r"
          style={{ width: '28%', borderColor: '#1e1e1e', backgroundColor: '#0a0a0a' }}
        >
          <div className="px-3 py-2 border-b text-[10px] uppercase tracking-widest text-neutral-500" style={{ borderColor: '#1e1e1e' }}>
            Source
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            {/* Fake footage frame */}
            <div
              className="w-full h-full relative"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
              }}
            >
              {/* Fake waveform visualizer */}
              <div className="absolute bottom-6 left-3 right-3 flex items-end gap-0.5 h-10">
                {Array.from({ length: 40 }).map((_, i) => {
                  const h = Math.sin(i * 0.5) * 50 + 50;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm opacity-40"
                      style={{
                        height: `${h}%`,
                        backgroundColor: '#C8F135',
                      }}
                    />
                  );
                })}
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-2">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-[10px] text-white/30">Click to preview</p>
              </div>
            </div>
          </div>
          <div className="px-3 py-2 text-[10px] text-neutral-600">00:00:42:15 / 00:03:18:00</div>
        </div>

        {/* Center — Program monitor */}
        <div
          className="flex flex-col border-r"
          style={{ flex: 1, borderColor: '#1e1e1e', backgroundColor: '#050505' }}
        >
          <div className="px-3 py-2 border-b text-[10px] uppercase tracking-widest text-neutral-500" style={{ borderColor: '#1e1e1e' }}>
            Program
          </div>
          <div className="flex-1 relative overflow-hidden">
            {/* Simulated wedding cinematic frame */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(160deg, #1a1208 0%, #0a0a0a 40%, #0d1a1a 100%)',
              }}
            >
              {/* Fake cinematic bars */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-black" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-black" />

              {/* Golden-hour glow simulation */}
              <div
                className="absolute"
                style={{
                  top: '30%', right: '20%', width: '200px', height: '200px',
                  background: 'radial-gradient(circle, rgba(255,180,60,0.15) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />

              {/* Fake couple silhouette (just shapes) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1 opacity-50">
                <div className="w-8 h-24 rounded-t-full" style={{ backgroundColor: '#1a1208' }} />
                <div className="w-6 h-20 rounded-t-full" style={{ backgroundColor: '#1a1208' }} />
              </div>

              {/* Timecode overlay */}
              <div className="absolute top-10 left-3">
                <span className="text-[10px] font-mono" style={{ color: '#C8F135' }}>
                  00:01:23:08
                </span>
              </div>

              {/* Effect label */}
              <div className="absolute top-10 right-3">
                <span className="text-[9px] text-white/30">Lumetri Color ✓</span>
              </div>
            </div>
          </div>
          {/* Playback controls */}
          <div
            className="flex items-center justify-center gap-4 py-2.5 border-t"
            style={{ borderColor: '#1e1e1e', backgroundColor: '#0a0a0a' }}
          >
            {['⏮', '◀◀', '▶', '▶▶', '⏭'].map((ctrl, i) => (
              <button
                key={i}
                className="text-neutral-400 hover:text-white text-sm transition-colors"
              >
                {ctrl}
              </button>
            ))}
          </div>
        </div>

        {/* Right — Effects panel */}
        <div
          className="flex flex-col"
          style={{ width: '20%', backgroundColor: '#0a0a0a' }}
        >
          <div className="px-3 py-2 border-b text-[10px] uppercase tracking-widest text-neutral-500" style={{ borderColor: '#1e1e1e' }}>
            Lumetri Color
          </div>
          <div className="flex-1 px-3 py-3 flex flex-col gap-3">
            {[
              { label: 'Exposure', value: 0.4, color: '#C8F135' },
              { label: 'Contrast', value: 0.65, color: '#C8F135' },
              { label: 'Highlights', value: -0.2, color: '#00F5D4' },
              { label: 'Shadows', value: 0.35, color: '#00F5D4' },
              { label: 'Saturation', value: 0.7, color: '#FF6B6B' },
              { label: 'Temperature', value: 0.5, color: '#FFB84D' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] text-neutral-500">{item.label}</span>
                  <span className="text-[9px]" style={{ color: item.color }}>{Math.round(item.value * 100)}</span>
                </div>
                <div className="w-full h-0.5 rounded-full bg-neutral-800 relative">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.value * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="border-t"
        style={{ borderColor: '#1e1e1e', backgroundColor: '#0a0a0a' }}
      >
        {/* Timeline header */}
        <div
          className="flex items-center gap-3 px-4 py-2 border-b"
          style={{ borderColor: '#1e1e1e' }}
        >
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">Sequence: Riya_Arjun_Teaser</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[9px] text-neutral-600">Timecode</span>
            <span className="text-[10px] font-mono" style={{ color: '#C8F135' }}>00:01:23:08</span>
          </div>
        </div>

        {/* Timeline ruler */}
        <div className="flex h-4 border-b overflow-hidden" style={{ borderColor: '#1e1e1e', marginLeft: '100px' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex-1 border-l flex items-end pb-0.5 pl-1" style={{ borderColor: '#1e1e1e' }}>
              <span className="text-[8px] text-neutral-700">0{i + 1}:00</span>
            </div>
          ))}
        </div>

        {/* Track rows */}
        <div className="flex flex-col">
          {tracks.map((track, idx) => (
            <div key={idx} className="flex h-8 border-b" style={{ borderColor: '#1a1a1a' }}>
              {/* Track label */}
              <div
                className="flex items-center px-3 text-[9px] text-neutral-500 shrink-0 border-r"
                style={{ width: '100px', borderColor: '#1e1e1e' }}
              >
                {track.label.split('—')[0]}
              </div>
              {/* Track area */}
              <div className="flex-1 relative flex items-center px-2">
                <div
                  className="h-5 rounded-sm flex items-center px-2 text-[8px] font-medium"
                  style={{
                    width: track.width,
                    backgroundColor: track.color + '22',
                    borderLeft: `3px solid ${track.color}`,
                    color: track.color,
                  }}
                >
                  {track.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseScroll;
