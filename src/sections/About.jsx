import React from 'react';

const About = () => {
  const skills = [
    'Premiere Pro',
    'After Effects',
    'DaVinci Resolve',
    'Final Cut Pro',
    'Color Grading',
    'Motion Graphics',
    'Sound Design',
    '4K / Cinematic',
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-32 px-6 md:px-16 lg:px-24"
      style={{ backgroundColor: 'var(--color-bg-light)' }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Left column — Visual */}
        <div className="relative">
          <div
            className="aspect-[4/5] rounded-lg overflow-hidden relative"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            {/* Aman's actual photo */}
            <img
              src="/aman.photo.png"
              alt="Aman Sharma — Video Editor"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            {/* Subtle neon gradient overlay for cinematic feel */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(8,11,20,0.7) 0%, transparent 50%), linear-gradient(135deg, rgba(124,58,237,0.08) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* Floating badge */}
          <div
            className="absolute -bottom-4 -right-4 md:bottom-6 md:right-[-20px] px-5 py-4 rounded-lg shadow-2xl"
            style={{ backgroundColor: 'var(--color-accent-1)' }}
          >
            <span
              className="text-3xl font-bold text-black block leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              3+
            </span>
            <span
              className="text-[10px] uppercase tracking-wider text-black/80 font-medium"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Years Experience
            </span>
          </div>
        </div>

        {/* Right column — Text content */}
        <div>
          {/* Section label */}
          <span
            className="text-xs uppercase tracking-[0.3em] mb-4 block"
            style={{
              fontFamily: "var(--font-heading)",
              color: 'var(--color-accent-1)',
            }}
          >
            About Me
          </span>

          {/* Section title */}
          <h2
            className="text-5xl md:text-6xl lg:text-7xl mb-8 leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Visual
            <br />
            Storyteller.
          </h2>

          {/* Paragraphs */}
          <p
            className="text-base leading-relaxed mb-4"
            style={{
              fontFamily: "var(--font-body)",
              color: 'var(--color-text-muted)',
            }}
          >
            I'm Aman Sharma, a passionate video editor and cinematographer based in Pune, Maharashtra. I specialize in crafting cinematic visual stories — from dreamy wedding teasers to high-energy showreels that leave lasting impressions.
          </p>
          <p
            className="text-base leading-relaxed mb-10"
            style={{
              fontFamily: "var(--font-body)",
              color: 'var(--color-text-muted)',
            }}
          >
            With over 3 years of experience, I bring a unique blend of storytelling sensibility, color science expertise, and attention to every single frame. Every project is a new story waiting to be told.
          </p>

          {/* Skills grid */}
          <div className="grid grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div
                key={skill}
                className="px-4 py-3 rounded-md border transition-all duration-300 hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] group"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--color-border)',
                }}
              >
                <span
                  className="text-xs uppercase tracking-wider transition-colors duration-300"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
