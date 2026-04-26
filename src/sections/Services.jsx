import React from 'react';
import ServiceCard from '../components/cards/ServiceCard';

const servicesData = [
  {
    emoji: '🎬',
    title: 'Wedding Teaser',
    description:
      'Cinematic, emotion-filled wedding teasers under 3 minutes that capture the magic of the day.',
    pricing: 'Custom Pricing',
  },
  {
    emoji: '💑',
    title: 'Pre-Wedding Film',
    description:
      'Romantic, story-driven pre-wedding teasers shot at stunning locations.',
    pricing: 'Custom Pricing',
  },
  {
    emoji: '🎞️',
    title: 'Showreel',
    description:
      'Dynamic high-impact reels for brands, creators, and professionals.',
    pricing: 'Custom Pricing',
  },
  {
    emoji: '🎙️',
    title: 'Podcast Editing',
    description:
      'Clean edits with sound balancing, sharp cuts, captions, and custom B-roll.',
    pricing: 'Custom Pricing',
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="py-20 md:py-32 px-6 md:px-16 lg:px-24"
      style={{ backgroundColor: 'var(--color-bg-light)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <span
          className="text-xs uppercase tracking-[0.3em] mb-4 block"
          style={{
            fontFamily: "var(--font-heading)",
            color: 'var(--color-accent-1)',
          }}
        >
          Services
        </span>

        {/* Section title */}
        <h2
          className="text-5xl md:text-6xl lg:text-7xl mb-12 leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What I
          <br />
          Offer
        </h2>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesData.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
