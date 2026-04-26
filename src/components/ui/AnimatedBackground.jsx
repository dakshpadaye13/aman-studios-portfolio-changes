import { useEffect, useRef } from 'react';

/**
 * AnimatedBackground — a full-canvas animated scene with:
 *   • Flowing 3D ribbon/silk shapes (like the Jack portfolio)
 *   • Floating glowing orbs
 *   • Soft particle field
 *   • Subtle aurora gradient layers
 */
const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Orbs ──────────────────────────────────────────────────
    const orbs = [
      { x: 0.15, y: 0.25, r: 320, color: [124, 58, 237],   speed: 0.0007, ox: 0, oy: 0 },
      { x: 0.82, y: 0.15, r: 280, color: [6, 182, 212],    speed: 0.0005, ox: 0, oy: 0 },
      { x: 0.65, y: 0.75, r: 360, color: [200, 241, 53],   speed: 0.0006, ox: 0, oy: 0 },
      { x: 0.3,  y: 0.7,  r: 220, color: [249, 115, 22],   speed: 0.0009, ox: 0, oy: 0 },
    ];

    // ── Particles ─────────────────────────────────────────────
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.0002 + 0.0001,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    // ── Ribbon helpers ────────────────────────────────────────
    const drawRibbon = (cx, cy, width, height, twist, phase, color1, color2, alpha) => {
      const segments = 60;
      ctx.save();
      for (let i = 0; i < segments; i++) {
        const u = i / segments;
        const u2 = (i + 1) / segments;

        const x1 = cx + Math.sin(u * Math.PI * 2 + phase) * width;
        const y1 = cy + u * height - height / 2;
        const x2 = cx + Math.sin(u2 * Math.PI * 2 + phase) * width;
        const y2 = cy + u2 * height - height / 2;

        const wobble = Math.sin(u * Math.PI * 4 + twist) * 18;
        const thickness = 12 + Math.abs(Math.sin(u * Math.PI + twist)) * 28;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(${color1}, ${alpha * (0.4 + 0.6 * Math.abs(Math.sin(u * Math.PI * 3)))})`);
        grad.addColorStop(1, `rgba(${color2}, ${alpha * (0.2 + 0.5 * Math.abs(Math.cos(u * Math.PI * 3)))})`);

        ctx.beginPath();
        ctx.moveTo(x1 + wobble, y1);
        ctx.lineTo(x1 - wobble, y1);
        ctx.lineTo(x2 - wobble, y2);
        ctx.lineTo(x2 + wobble, y2);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    };

    const draw = () => {
      t += 0.008;
      const W = canvas.width;
      const H = canvas.height;

      // ── Clear ──────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // ── Base gradient bg ───────────────────────────────────
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
      bg.addColorStop(0, '#0D1225');
      bg.addColorStop(0.5, '#08091A');
      bg.addColorStop(1, '#050810');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Glowing orbs ──────────────────────────────────────
      orbs.forEach((o, i) => {
        const px = (o.x + Math.sin(t * o.speed * 1000 + i) * 0.12) * W;
        const py = (o.y + Math.cos(t * o.speed * 800 + i * 1.3) * 0.10) * H;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, o.r);
        grad.addColorStop(0,   `rgba(${o.color}, 0.18)`);
        grad.addColorStop(0.4, `rgba(${o.color}, 0.07)`);
        grad.addColorStop(1,   `rgba(${o.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Flowing ribbons (3D-like silk) ─────────────────────
      // Ribbon 1 — purple/cyan
      drawRibbon(
        W * 0.2, H * 0.5,
        W * 0.18, H * 1.1,
        t * 0.6,
        t * 0.4,
        '124,58,237', '6,182,212', 0.55
      );

      // Ribbon 2 — neon/purple
      drawRibbon(
        W * 0.8, H * 0.45,
        W * 0.14, H * 1.0,
        -t * 0.5 + 1,
        -t * 0.3 + 2,
        '200,241,53', '124,58,237', 0.40
      );

      // Ribbon 3 — orange/cyan (background layer)
      drawRibbon(
        W * 0.5, H * 0.6,
        W * 0.25, H * 0.8,
        t * 0.3 + 0.5,
        t * 0.2 + 1,
        '249,115,22', '6,182,212', 0.22
      );

      // ── Particles ─────────────────────────────────────────
      particles.forEach((p, i) => {
        const px = ((p.x + Math.sin(t * p.speed * 1000 + i) * 0.05) % 1) * W;
        const py = ((p.y + t * p.speed * 0.5) % 1) * H;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        const colors = ['200,241,53', '124,58,237', '6,182,212'];
        const c = colors[i % colors.length];
        ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
        ctx.fill();
      });

      // ── Top aurora bar ────────────────────────────────────
      const aurora = ctx.createLinearGradient(0, 0, W, 0);
      aurora.addColorStop(0,    'rgba(124,58,237,0)');
      aurora.addColorStop(0.25, `rgba(124,58,237,${0.1 + 0.05 * Math.sin(t)})`);
      aurora.addColorStop(0.5,  `rgba(6,182,212,${0.12 + 0.05 * Math.cos(t * 1.3)})`);
      aurora.addColorStop(0.75, `rgba(200,241,53,${0.08 + 0.04 * Math.sin(t * 0.7)})`);
      aurora.addColorStop(1,    'rgba(200,241,53,0)');
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, W, H * 0.35);

      // ── Vignette ──────────────────────────────────────────
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(4,5,14,0.65)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedBackground;
