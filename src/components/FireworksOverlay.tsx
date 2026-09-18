import React, { useEffect, useRef } from 'react';

interface FireworksOverlayProps {
  active: boolean;
  onComplete?: () => void;
  particleCount?: number;
  duration?: number; // ms
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
  shape: 'circle' | 'heart' | 'spark';
}

const FIREWORK_COLORS = [
  '#FF1493', // Deep Pink
  '#FF69B4', // Hot Pink
  '#FFB6C1', // Light Pink
  '#FFD700', // Gold
  '#FFA500', // Orange
  '#FF4500', // OrangeRed
  '#F43F5E', // Rose
  '#A855F7', // Purple
  '#38BDF8', // Sky Blue
  '#FFFFFF', // Starlight White
];

export const FireworksOverlay: React.FC<FireworksOverlayProps> = ({
  active,
  onComplete,
  duration = 3200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];

    // Resize canvas to match its container size
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();

    const createFireworkBurst = (originX?: number, originY?: number) => {
      const x = originX ?? Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
      const y = originY ?? Math.random() * (canvas.height * 0.5) + canvas.height * 0.15;
      const burstColor = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      const numParticles = 40 + Math.floor(Math.random() * 25);

      for (let i = 0; i < numParticles; i++) {
        const angle = (Math.PI * 2 * i) / numParticles + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 4.5 + 2;
        const isHeart = Math.random() > 0.7;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          color: Math.random() > 0.3 ? burstColor : FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
          size: Math.random() * 3 + 2,
          gravity: 0.08,
          shape: isHeart ? 'heart' : Math.random() > 0.5 ? 'circle' : 'spark',
        });
      }
    };

    // Initial triple burst
    createFireworkBurst(canvas.width * 0.3, canvas.height * 0.35);
    createFireworkBurst(canvas.width * 0.7, canvas.height * 0.3);
    createFireworkBurst(canvas.width * 0.5, canvas.height * 0.25);

    // Staggered bursts throughout the duration
    const intervalId = setInterval(() => {
      createFireworkBurst();
    }, 450);

    const startTime = performance.now();

    const drawHeart = (c: CanvasRenderingContext2D, px: number, py: number, size: number) => {
      c.save();
      c.translate(px, py);
      c.scale(size / 6, size / 6);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-2, -3, -5, -1, -5, 2);
      c.bezierCurveTo(-5, 4, -2, 6, 0, 8);
      c.bezierCurveTo(2, 6, 5, 4, 5, 2);
      c.bezierCurveTo(5, -1, 2, -3, 0, 0);
      c.fill();
      c.restore();
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        if (p.shape === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size * 2);
        } else if (p.shape === 'spark') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          // Sparkling cross arms
          ctx.fillRect(p.x - p.size * 1.5, p.y - 0.5, p.size * 3, 1);
          ctx.fillRect(p.x - 0.5, p.y - p.size * 1.5, 1, p.size * 3);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (time - startTime < duration || particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        clearInterval(intervalId);
        onComplete?.();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleWindowResize = () => resizeCanvas();
    window.addEventListener('resize', handleWindowResize);

    const timer = setTimeout(() => {
      clearInterval(intervalId);
    }, duration);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
      clearTimeout(timer);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [active, duration, onComplete]);

  if (!active) return null;

  return (
    <div
      id="fireworks-animation-overlay"
      className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-2xl"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
