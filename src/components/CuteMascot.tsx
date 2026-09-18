import React from 'react';

interface CuteMascotProps {
  mood?: 'asking' | 'surprised' | 'ecstatic' | 'pleading';
  dodgeCount?: number;
}

export const CuteMascot: React.FC<CuteMascotProps> = ({ mood = 'asking', dodgeCount = 0 }) => {
  return (
    <div className="relative w-36 h-36 mx-auto select-none pointer-events-none transition-transform duration-300 transform hover:scale-105">
      {/* Glow aura */}
      <div className="absolute inset-0 bg-pink-300/30 rounded-full blur-xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bear ears */}
        <circle cx="58" cy="55" r="28" fill="#FDE2E4" stroke="#F43F5E" strokeWidth="3" />
        <circle cx="58" cy="55" r="16" fill="#FBBF24" opacity="0.3" />
        <circle cx="142" cy="55" r="28" fill="#FDE2E4" stroke="#F43F5E" strokeWidth="3" />
        <circle cx="142" cy="55" r="16" fill="#FBBF24" opacity="0.3" />

        {/* Bear head */}
        <ellipse cx="100" cy="100" rx="68" ry="60" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="3.5" />

        {/* Cute blush cheeks */}
        <ellipse cx="62" cy="112" rx="14" ry="8" fill="#FDA4AF" opacity="0.8" />
        <ellipse cx="138" cy="112" rx="14" ry="8" fill="#FDA4AF" opacity="0.8" />

        {/* Eyes based on mood */}
        {mood === 'ecstatic' ? (
          // Joyful smiling eyes (happy arcs)
          <>
            <path d="M 68 88 Q 78 74 88 88" stroke="#881337" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 112 88 Q 122 74 132 88" stroke="#881337" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        ) : mood === 'pleading' || dodgeCount > 3 ? (
          // Big puppy pleading anime eyes with sparkle
          <>
            <ellipse cx="76" cy="88" rx="10" ry="12" fill="#881337" />
            <circle cx="73" cy="84" r="4" fill="white" />
            <circle cx="78" cy="92" r="2" fill="white" />

            <ellipse cx="124" cy="88" rx="10" ry="12" fill="#881337" />
            <circle cx="121" cy="84" r="4" fill="white" />
            <circle cx="126" cy="92" r="2" fill="white" />
          </>
        ) : (
          // Cute normal bright eyes
          <>
            <ellipse cx="76" cy="88" rx="8" ry="10" fill="#4C0519" />
            <circle cx="74" cy="85" r="3.5" fill="white" />
            <circle cx="78" cy="91" r="1.5" fill="white" />

            <ellipse cx="124" cy="88" rx="8" ry="10" fill="#4C0519" />
            <circle cx="122" cy="85" r="3.5" fill="white" />
            <circle cx="126" cy="91" r="1.5" fill="white" />
          </>
        )}

        {/* Cute snout & nose */}
        <ellipse cx="100" cy="112" rx="18" ry="14" fill="white" stroke="#FDA4AF" strokeWidth="2" />
        <path d="M 94 106 C 94 104 106 104 106 106 C 106 110 100 113 100 113 C 100 113 94 110 94 106 Z" fill="#E11D48" />
        
        {/* Mouth */}
        {mood === 'ecstatic' ? (
          <path d="M 92 114 Q 100 126 108 114" stroke="#881337" strokeWidth="3" strokeLinecap="round" fill="#FDA4AF" />
        ) : (
          <path d="M 94 114 Q 100 120 106 114" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Sparkling Diamond Ring / Rose held in paws */}
        <g transform="translate(100, 155)">
          {/* Paw holding */}
          <ellipse cx="-24" cy="-8" rx="10" ry="8" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="2.5" />
          <ellipse cx="24" cy="-8" rx="10" ry="8" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="2.5" />

          {/* Velvet ring box */}
          <rect x="-20" y="-14" width="40" height="28" rx="7" fill="#BE123C" stroke="#881337" strokeWidth="2" />
          <rect x="-18" y="-12" width="36" height="6" rx="3" fill="#E11D48" />

          {/* Diamond ring */}
          <circle cx="0" cy="-18" r="9" stroke="#F59E0B" strokeWidth="3" fill="none" />
          {/* Diamond gem */}
          <polygon
            points="0,-28 7,-22 4,-17 -4,-17 -7,-22"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="1.5"
            className="animate-pulse"
          />
          {/* Sparkle star */}
          <path
            d="M 12 -28 Q 15 -28 15 -31 Q 15 -28 18 -28 Q 15 -28 15 -25 Q 15 -28 12 -28 Z"
            fill="#FBBF24"
            className="animate-ping"
          />
        </g>
      </svg>
    </div>
  );
};
