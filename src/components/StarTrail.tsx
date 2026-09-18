import React, { useEffect, useRef } from 'react';

interface StarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  vRot: number;
}

const STAR_COLORS = [
  '#FDE68A', // soft gold
  '#F472B6', // romantic pink
  '#FDA4AF', // rose shimmer
  '#FEF08A', // warm yellow
  '#FFFFFF', // pure sparkle
  '#E0E7FF', // soft celestial lavender
];

export const StarTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: StarParticle[] = [];
    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnStar = (x: number, y: number) => {
      // Spawn 1-2 tiny sparkles
      const count = Math.random() > 0.4 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.9 + 0.3;
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.15, // slight gentle fall
          size: Math.random() * 3.5 + 2,
          alpha: 0.9,
          decay: Math.random() * 0.02 + 0.015,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.08,
        });
      }
      // Cap maximum active particles for high performance
      if (particles.length > 70) {
        particles.splice(0, particles.length - 70);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!hasMoved) {
        lastX = x;
        lastY = y;
        hasMoved = true;
      }

      // Calculate distance from last position to interpolate if moving quickly
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 6) {
        spawnStar(x, y);
        // If rapid movement, interpolate intermediate star
        if (dist > 25) {
          spawnStar((x + lastX) / 2, (y + lastY) / 2);
        }
        lastX = x;
        lastY = y;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Draw a 4-pointed star
    const drawFourPointStar = (c: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(rot);
      c.beginPath();
      const spikes = 4;
      const innerRadius = r * 0.28;

      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? r : innerRadius;
        const a = (i * Math.PI) / spikes;
        const px = Math.cos(a) * radius;
        const py = Math.sin(a) * radius;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        drawFourPointStar(ctx, p.x, p.y, p.size, p.rotation);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cursor-star-trail-canvas"
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};
