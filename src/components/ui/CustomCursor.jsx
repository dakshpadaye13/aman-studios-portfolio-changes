import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only enable custom cursor on desktop
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const animate = () => {
      // Smooth ring follow with lag
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(animate);

    // Show cursors
    if (dotRef.current) dotRef.current.style.opacity = '1';
    if (ringRef.current) ringRef.current.style.opacity = '1';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed z-[9999] pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: 'var(--color-accent-1)',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed z-[9998] pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2 rounded-full border hidden md:block"
        style={{
          width: '36px',
          height: '36px',
          borderColor: 'rgba(200,241,53,0.4)',
        }}
      />
    </>
  );
};

export default CustomCursor;
