import React from 'react';

const ServiceCard = ({ emoji, title, description, pricing }) => {
  return (
    <div
      className="relative p-7 rounded-lg border transition-all duration-300 hover:border-[var(--color-accent-1)] group overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Hover gradient wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(200,241,53,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10">
        {/* Emoji icon */}
        <span className="text-3xl mb-5 block">{emoji}</span>

        {/* Title */}
        <h3
          className="text-xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{
            fontFamily: "var(--font-body)",
            color: 'var(--color-text-muted)',
          }}
        >
          {description}
        </p>

        {/* Pricing */}
        <span
          className="text-lg tracking-wide"
          style={{
            fontFamily: "var(--font-display)",
            color: 'var(--color-accent-1)',
          }}
        >
          {pricing}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
