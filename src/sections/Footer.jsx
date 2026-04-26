import React from 'react';

const Footer = () => {
  return (
    <footer
      className="w-full py-8 px-6 md:px-16 lg:px-24 border-t"
      style={{
        backgroundColor: 'var(--color-bg-light)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left — Copyright */}
        <p
          className="text-xs order-3 md:order-1"
          style={{
            fontFamily: "var(--font-body)",
            color: 'var(--color-text-muted)',
          }}
        >
          © 2025 Aman Sharma. All rights reserved.
        </p>

        {/* Center — Logo */}
        <span
          className="text-3xl font-bold text-white order-1 md:order-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AS
        </span>

        {/* Right — Location */}
        <p
          className="text-xs order-2 md:order-3"
          style={{
            fontFamily: "var(--font-body)",
            color: 'var(--color-text-muted)',
          }}
        >
          Pune, Maharashtra
        </p>
      </div>
    </footer>
  );
};

export default Footer;
