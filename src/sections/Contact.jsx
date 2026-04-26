import React, { useState } from 'react';

const contactLinks = [
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 78229 44099',
    href: 'tel:+917822944099',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'sharmaaman15053@gmail.com',
    href: 'mailto:sharmaaman15053@gmail.com',
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    value: 'aman-sharma-57bb31312',
    href: 'https://linkedin.com/in/aman-sharma-57bb31312',
  },
  {
    icon: '📸',
    label: 'Instagram',
    value: '@amansharma.edits',
    href: '#',
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: '+91 78229 44099',
    href: 'https://wa.me/917822944099',
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    alert('Message sent! Aman will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 px-6 md:px-16 lg:px-24"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
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
          Contact
        </span>

        {/* Section title */}
        <h2
          className="text-5xl md:text-6xl lg:text-7xl mb-14 leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Let's Create
          <br />
          Together
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left column — Contact links */}
          <div className="flex flex-col gap-3">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 hover:border-[var(--color-accent-1)] group"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {/* Icon box */}
                <div
                  className="w-12 h-12 rounded-md flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  {link.icon}
                </div>
                {/* Text */}
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] block mb-0.5"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: 'var(--color-accent-1)',
                    }}
                  >
                    {link.label}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {link.value}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Right column — Contact form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="text-[10px] uppercase tracking-[0.2em] mb-2 block"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: 'var(--color-text-muted)',
                }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-md border text-sm text-white outline-none transition-all duration-300 focus:border-[var(--color-accent-1)]"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-[10px] uppercase tracking-[0.2em] mb-2 block"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: 'var(--color-text-muted)',
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-md border text-sm text-white outline-none transition-all duration-300 focus:border-[var(--color-accent-1)]"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
                placeholder="your@email.com"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="text-[10px] uppercase tracking-[0.2em] mb-2 block"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: 'var(--color-text-muted)',
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3.5 rounded-md border text-sm text-white outline-none resize-none transition-all duration-300 focus:border-[var(--color-accent-1)]"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-md text-sm uppercase tracking-wider font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor: 'var(--color-accent-1)',
                color: '#000',
              }}
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
