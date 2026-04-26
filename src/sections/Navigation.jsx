import React, { useState } from 'react';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'about', href: '#about' },
    { label: 'portfolio', href: '#portfolio' },
    { label: 'services', href: '#services' },
    { label: 'contact', href: '#contact' },
  ];

  return (
    <>
      <nav className="absolute z-20 top-0 left-0 right-0 px-4 md:px-10 pt-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left pill — Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 bg-neutral-900/90 backdrop-blur-md rounded-full pl-4 pr-6 py-3"
          >
            {/* AS monogram */}
            <span
              className="text-white text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AS
            </span>
            <span
              className="text-white text-sm font-normal tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              aman sharma
            </span>
          </a>

          {/* Center pill — Nav links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur-md rounded-full px-3 py-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right — CTA button + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:block text-black text-sm font-medium rounded-full px-6 py-3 hover:opacity-90 transition-all"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: "var(--color-accent-1)",
              }}
            >
              get in touch
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-12 h-12 bg-neutral-900/90 backdrop-blur-md rounded-full"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[5px]">
                <span
                  className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-5 right-4 w-12 h-12 bg-neutral-900/90 backdrop-blur-md rounded-full flex items-center justify-center"
          aria-label="Close menu"
        >
          <span className="block w-5 h-[1.5px] bg-white rotate-45 absolute" />
          <span className="block w-5 h-[1.5px] bg-white -rotate-45 absolute" />
        </button>

        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-3xl font-light tracking-wide hover:opacity-70 transition-opacity"
            style={{
              fontFamily: "var(--font-display)",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {link.label}
          </a>
        ))}

        <a
          href="#contact"
          onClick={() => setMobileMenuOpen(false)}
          className="mt-6 text-black text-sm font-medium rounded-full px-8 py-3"
          style={{
            fontFamily: "var(--font-heading)",
            backgroundColor: "var(--color-accent-1)",
          }}
        >
          get in touch
        </a>
      </div>
    </>
  );
};

export default Navigation;
