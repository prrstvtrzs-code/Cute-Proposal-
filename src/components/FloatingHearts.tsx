import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';

interface FloatingItem {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  symbol: string;
  opacity: number;
}

const HEART_SYMBOLS = ['💖', '💕', '💗', '💓', '✨', '🌸', '🌹', '💌', '💍', '💘'];

export const FloatingHearts: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [clickHearts, setClickHearts] = useState<{ id: number; x: number; y: number; symbol: string }[]>([]);

  useEffect(() => {
    // Generate initial set of floating elements
    const initialItems: FloatingItem[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2, // 2% to 98%
      size: Math.floor(Math.random() * 16) + 14, // 14px to 30px
      duration: Math.random() * 8 + 8, // 8s to 16s float time
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 60,
      symbol: HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)],
      opacity: Math.random() * 0.4 + 0.35,
    }));
    setItems(initialItems);
  }, []);

  // Spawn heart on click anywhere on screen
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If user clicked inside an interactive button, skip
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea')) {
      return;
    }

    sound.playHeartPop();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      symbol: HEART_SYMBOLS[Math.floor(Math.random() * 5)],
    };

    setClickHearts((prev) => [...prev.slice(-15), newHeart]);

    // Clean up after animation
    setTimeout(() => {
      setClickHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  return (
    <div
      id="floating-hearts-background"
      onClick={handleScreenClick}
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden bg-radial from-rose-100/70 via-pink-50/50 to-rose-200/40"
    >
      {/* Romantic glowing orbs */}
      <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-pink-300/25 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating continuous hearts */}
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute select-none pointer-events-none transition-transform"
          style={{
            left: `${item.left}%`,
            bottom: '-40px',
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            animation: `floatUpward ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Burst hearts from mouse clicks */}
      {clickHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute select-none pointer-events-none text-2xl animate-ping"
          style={{
            left: heart.x - 14,
            top: heart.y - 14,
            animation: 'clickFloat 1.1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
          }}
        >
          {heart.symbol}
        </div>
      ))}
    </div>
  );
};
