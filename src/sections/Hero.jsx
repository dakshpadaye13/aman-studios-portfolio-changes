import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      imageRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.08)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#080B14' }}>
      {/* ── Hero image ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/hero-bg.png"
          alt="Video editor at work"
          className="w-full h-full object-cover object-center opacity-90 transition-transform duration-[1200ms] ease-out will-change-transform"
        />
      </div>

      {/* Subtle bottom fade so text at bottom is readable */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(8,11,20,0.75) 0%, transparent 40%)' }} />

      {/* ── Content ── */}
      <div className="relative h-full w-full">
        {/* Giant staggered words */}
        <h1 className="hero-title absolute text-white font-medium text-[16vw] md:text-[13vw] left-4 md:left-10 top-[18%] opacity-0 animate-fade-in-up">
          craft
        </h1>
        <h1 className="hero-title absolute text-white font-medium text-[16vw] md:text-[13vw] right-4 md:right-10 top-[38%] opacity-0 animate-fade-in-up animate-delay-200">
          your
        </h1>
        <h1
          className="hero-title absolute font-medium text-[16vw] md:text-[13vw] left-[10%] md:left-[28%] top-[58%] opacity-0 animate-fade-in-up animate-delay-400"
          style={{ color: 'var(--color-accent-1)' }}
        >
          story
        </h1>

        {/* Description */}
        <p className="absolute left-6 md:left-10 top-[46%] max-w-[260px] text-[15px] leading-snug text-white/70 opacity-0 animate-fade-in-up animate-delay-500" style={{ fontFamily: "var(--font-body)" }}>
          crafting stories that move people — frame by frame. professional cinematic video editing.
        </p>

        {/* Stat — top right */}
        <div className="absolute right-6 md:right-24 top-[14%] opacity-0 animate-fade-in-up animate-delay-300">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/30 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>+3</span>
          </div>
          <p className="text-xs md:text-sm text-white/50 mt-1 text-right" style={{ fontFamily: "var(--font-heading)" }}>years experience</p>
        </div>

        {/* Stat — bottom left */}
        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24 opacity-0 animate-fade-in-up animate-delay-600">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>+50</span>
            <div className="hidden md:block h-px w-24 bg-white/30 rotate-[-20deg]" />
          </div>
          <p className="text-xs md:text-sm text-white/50 mt-1" style={{ fontFamily: "var(--font-heading)" }}>cinematic projects</p>
        </div>

        {/* Stat — bottom right */}
        <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20 opacity-0 animate-fade-in-up animate-delay-700">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/30 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-1)" }}>4K</span>
          </div>
          <p className="text-xs md:text-sm text-white/50 mt-1 text-right" style={{ fontFamily: "var(--font-heading)" }}>resolution editing</p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40" style={{ fontFamily: "var(--font-heading)" }}>scroll</span>
          <div className="w-px h-10 scroll-pulse" style={{ background: 'linear-gradient(to bottom, rgba(200,241,53,0.6), transparent)' }} />
        </div>
      </div>

      {/* Bottom fade into site */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to bottom, transparent, #080B14)' }} />
    </section>
  );
};

export default Hero;
