import React from 'react';

const VideoCard = ({
  thumbnail,
  category,
  title,
  description,
  onWatch,
  onShare,
}) => {
  return (
    <div
      className="rounded-lg overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-1)] group"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: thumbnail
              ? `url(${thumbnail}) center/cover`
              : 'linear-gradient(135deg, #1a1a1a, #0d0d0d)',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center group-hover:bg-[var(--color-accent-1)] group-hover:border-[var(--color-accent-1)] transition-all duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-white group-hover:text-black ml-0.5 transition-colors duration-300"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5">
        <span
          className="text-[10px] uppercase tracking-[0.2em] mb-2 block"
          style={{
            fontFamily: "var(--font-heading)",
            color: 'var(--color-accent-1)',
          }}
        >
          {category}
        </span>
        <h3
          className="text-lg font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-5"
          style={{
            fontFamily: "var(--font-body)",
            color: 'var(--color-text-muted)',
          }}
        >
          {description}
        </p>

        {/* Action buttons */}
        <div
          className="border-t pt-4 flex gap-3"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            onClick={onWatch}
            className="flex-1 py-2.5 rounded-md border text-xs uppercase tracking-wider transition-all duration-300 hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
            style={{
              fontFamily: "var(--font-heading)",
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            Watch
          </button>
          <button
            onClick={onShare}
            className="flex-1 py-2.5 rounded-md border text-xs uppercase tracking-wider transition-all duration-300 hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
            style={{
              fontFamily: "var(--font-heading)",
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
