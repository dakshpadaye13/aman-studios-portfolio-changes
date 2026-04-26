import React from 'react';

const Marquee = () => {
  const items = [
    { text: 'WEDDING TEASER', highlight: true },
    { text: 'PRE-WEDDING', highlight: false },
    { text: 'SHOWREEL', highlight: true },
    { text: 'PODCAST', highlight: false },
    { text: 'COLOR GRADING', highlight: false },
    { text: 'MOTION GRAPHICS', highlight: true },
    { text: 'WEDDING TEASER', highlight: true },
    { text: 'PRE-WEDDING', highlight: false },
    { text: 'SHOWREEL', highlight: true },
    { text: 'PODCAST', highlight: false },
    { text: 'COLOR GRADING', highlight: false },
    { text: 'MOTION GRAPHICS', highlight: true },
  ];

  const renderItems = () =>
    items.map((item, i) => (
      <span key={i} className="flex items-center gap-6 shrink-0">
        <span
          className={`text-sm md:text-base font-medium tracking-[0.2em] uppercase whitespace-nowrap ${
            item.highlight ? '' : 'text-[#2A2A2A]'
          }`}
          style={{
            fontFamily: "var(--font-heading)",
            color: item.highlight ? 'var(--color-accent-1)' : undefined,
          }}
        >
          {item.text}
        </span>
        <span className="text-[#1E2D4A] text-lg">·</span>
      </span>
    ));

  return (
    <div
      className="w-full overflow-hidden py-5 border-t border-b"
      style={{
        background: 'rgba(13,16,32,0.92)',
        borderColor: 'rgba(124,58,237,0.2)',
      }}
    >
      <div className="marquee-track flex items-center gap-6">
        <div className="flex items-center gap-6 shrink-0 marquee-scroll">
          {renderItems()}
        </div>
        <div className="flex items-center gap-6 shrink-0 marquee-scroll" aria-hidden>
          {renderItems()}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
