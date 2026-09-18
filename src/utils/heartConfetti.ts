import confetti from 'canvas-confetti';

// SVG Path for a romantic heart
const HEART_SVG_PATH =
  'M 167 72 c 19 -38 37 -56 75 -56 c 42 0 76 33 76 75 c 0 76 -76 151 -151 227 c -76 -76 -151 -151 -151 -227 c 0 -42 33 -75 75 -75 c 38 0 57 18 76 56 z';

export const fireHeartConfetti = (options?: {
  originX?: number;
  originY?: number;
  count?: number;
}) => {
  const { originX = 0.5, originY = 0.45, count = 55 } = options || {};

  try {
    let heartShape: any;
    if (typeof (confetti as any).shapeFromPath === 'function') {
      heartShape = (confetti as any).shapeFromPath({ path: HEART_SVG_PATH });
    }

    // Left cannon burst
    confetti({
      shapes: heartShape ? [heartShape] : undefined,
      scalar: heartShape ? 2.3 : 1.2,
      particleCount: Math.round(count * 0.6),
      spread: 75,
      angle: 60,
      origin: { x: originX - 0.15, y: originY },
      colors: ['#FF1493', '#F43F5E', '#E11D48', '#FB7185', '#FFD700', '#FDA4AF'],
      ticks: 240,
    });

    // Right cannon burst
    confetti({
      shapes: heartShape ? [heartShape] : undefined,
      scalar: heartShape ? 2.3 : 1.2,
      particleCount: Math.round(count * 0.6),
      spread: 75,
      angle: 120,
      origin: { x: originX + 0.15, y: originY },
      colors: ['#FF1493', '#F43F5E', '#E11D48', '#FB7185', '#FFD700', '#FDA4AF'],
      ticks: 240,
    });
  } catch {
    // Graceful fallback
    confetti({
      particleCount: count,
      spread: 90,
      origin: { x: originX, y: originY },
      colors: ['#FF1493', '#F43F5E', '#FB7185', '#FFD700'],
    });
  }
};
