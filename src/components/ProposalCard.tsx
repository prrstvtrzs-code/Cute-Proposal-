import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Volume2, VolumeX, Settings, Send, Flame, Download } from 'lucide-react';
import { sound } from '../utils/audio';
import { CuteMascot } from './CuteMascot';
import { ProposalConfig } from '../types';
import { downloadProposalCardImage } from '../utils/downloadCard';
import { activityTracker } from '../utils/activityTracker';

interface ProposalCardProps {
  config: ProposalConfig;
  onYes: () => void;
  onOpenSettings: () => void;
  onOpenReport?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const FUNNY_DODGE_MESSAGES = [
  "Are you sure? Think about it! 🥺",
  "Wait, think of all the snacks I buy you! 🍕",
  "Oops, slippery button! 🧼",
  "Nice try, but you can't escape my love! 🏃‍♂️💨",
  "Error 404: 'No' does not exist in our destiny! 💍",
  "I'll give you unlimited forehead kisses forever! 💋",
  "Look how huge and pretty the YES button is! 👉",
  "My heart is literally beating so fast right now! 💓",
  "Cupid told me this button was disabled by decree! 🏹",
  "I already told my mom you said YES! 🙈",
  "You've tried this many times... just surrender to love! 🥰",
  "Who will kill the spiders for you?! 🕷️🚫",
  "Resistance is futile, my cuddles are unmatched! 🧸",
  "Please? I love you to pieces! 💖✨"
];

export const ProposalCard: React.FC<ProposalCardProps> = ({
  config,
  onYes,
  onOpenSettings,
  onOpenReport,
  isMuted,
  onToggleMute,
}) => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [funnyMessage, setFunnyMessage] = useState<string | null>(null);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const secretClickRef = useRef<number>(0);

  // Initialize partner session tracking on load
  useEffect(() => {
    activityTracker.initSession();
  }, []);

  // Play romantic chime on initial load after user gesture
  useEffect(() => {
    const handleFirstInteraction = () => {
      sound.playRomanticChime(config.chimeSound || 'celesta');
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [config.chimeSound]);

  // Calculate runaway position safely within the viewport
  const moveNoButton = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    sound.playDodge();

    const newCount = dodgeCount + 1;
    setDodgeCount(newCount);

    // Pick funny message
    const msg = FUNNY_DODGE_MESSAGES[(newCount - 1) % FUNNY_DODGE_MESSAGES.length];
    setFunnyMessage(msg);

    // Track dodge event in confidential activity tracker
    activityTracker.logDodge(newCount, msg);

    // Calculate safe bounding box within viewport
    const buttonWidth = 130;
    const buttonHeight = 54;
    const padding = 20;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Pick random coordinates across screen, keeping safe margins
    const maxX = Math.max(padding, viewportWidth - buttonWidth - padding);
    const maxY = Math.max(padding, viewportHeight - buttonHeight - padding);

    let randomX = Math.floor(Math.random() * (maxX - padding) + padding);
    let randomY = Math.floor(Math.random() * (maxY - padding) + padding);

    // Ensure it doesn't spawn exactly over the YES button
    const yesBtn = document.getElementById('yes-proposal-button');
    if (yesBtn) {
      const yesRect = yesBtn.getBoundingClientRect();
      // If it overlaps YES button zone, push it away
      if (
        randomX > yesRect.left - 60 &&
        randomX < yesRect.right + 60 &&
        randomY > yesRect.top - 40 &&
        randomY < yesRect.bottom + 40
      ) {
        randomY = randomY < viewportHeight / 2 ? randomY + 160 : randomY - 160;
        randomY = Math.max(padding, Math.min(maxY, randomY));
      }
    }

    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    sound.playYesCelebration();

    // Log the moment she said YES!
    activityTracker.logYes(dodgeCount);

    // Confetti fireworks explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#FBBF24', '#BE185D'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#E11D48', '#FFD700', '#F472B6'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E11D48', '#FFD700', '#F472B6'],
      });
    }, 250);

    onYes();
  };

  // The YES button scale dynamically grows with each attempt to hit NO
  const yesScale = 1 + Math.min(dodgeCount * 0.14, 1.6);

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Top action bar: sound toggle, download keepsake & customize names */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4">
        <button
          id="toggle-sound-button"
          onClick={onToggleMute}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-rose-700 shadow-sm border border-rose-200 text-xs font-medium transition-all backdrop-blur-sm cursor-pointer"
          title={isMuted ? 'Unmute romantic sound effects' : 'Mute sound effects'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />}
          <span>{isMuted ? 'Sound Off' : 'Romantic Audio'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="download-card-button"
            onClick={() => {
              sound.playRomanticChime(config.chimeSound || 'celesta');
              activityTracker.logKeepsakeDownload('Proposal Card');
              downloadProposalCardImage(config, 'proposal');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 shadow-sm border border-rose-300 text-xs font-semibold transition-all backdrop-blur-sm cursor-pointer hover:scale-105 active:scale-95"
            title="Download high-resolution keepsake card image"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            <span>Download Keepsake</span>
          </button>

          <button
            id="open-customizer-button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-rose-700 shadow-sm border border-rose-200 text-xs font-medium transition-all backdrop-blur-sm cursor-pointer"
            title="Personalize names & sounds"
          >
            <Settings className="w-3.5 h-3.5 text-rose-500" />
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* Main Romance Card */}
      <div
        ref={containerRef}
        className="w-full relative bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl shadow-rose-200/50 border-2 border-rose-200/80 text-center transition-all"
      >
        {/* Decorative corner flourishes */}
        <div className="absolute top-3 left-3 text-rose-300 text-xl select-none">❧</div>
        <div className="absolute top-3 right-3 text-rose-300 text-xl select-none">☙</div>
        <div className="absolute bottom-3 left-3 text-rose-300 text-xl select-none">❦</div>
        <div className="absolute bottom-3 right-3 text-rose-300 text-xl select-none">❦</div>

        {/* Mascot with emotion reflecting dodge state */}
        <div className="mb-2">
          <CuteMascot
            mood={dodgeCount > 0 ? 'pleading' : 'asking'}
            dodgeCount={dodgeCount}
          />
        </div>

        {/* Funny dynamic bubble when No is dodged */}
        {funnyMessage && (
          <div
            id="funny-dodge-speech-bubble"
            className="mb-4 inline-block bg-rose-100 text-rose-900 px-4 py-2 rounded-2xl text-sm font-semibold border border-rose-300 shadow-sm animate-bounce"
          >
            {funnyMessage}
          </div>
        )}

        {/* Romantic salutation */}
        <div className="mb-2 inline-flex items-center gap-1.5 text-rose-500 font-script text-2xl sm:text-3xl font-bold">
          <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>To My Dearest {config.partnerName || 'Love of My Life'}</span>
          <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
        </div>

        {/* The Big Proposal Question */}
        <h1
          id="proposal-headline"
          className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-slate-800 tracking-tight mb-3"
        >
          {config.proposalType === 'marry'
            ? 'Will You Be Mine Forever?'
            : config.proposalType === 'girlfriend'
            ? 'Will You Be My Girlfriend?'
            : 'Will You Be Mine Forever?'}
        </h1>

        {/* Sweet or funny custom message */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-6">
          {config.customMessage ||
            "Every second with you feels like magic. You're my best friend, my favorite adventure, and my true love. Say yes and let's make forever official! 💍✨"}
        </p>

        {/* Dodge Counter Badge (if she tried dodging) */}
        {dodgeCount > 0 && (
          <div className="mb-6 inline-flex items-center gap-1 text-xs text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Escape attempts thwarted: <strong>{dodgeCount}</strong></span>
          </div>
        )}

        {/* Action Buttons: YES and RUNAWAY NO */}
        <div className="relative min-h-[90px] flex items-center justify-center gap-6 mt-4">
          {/* THE GROWING & HEARTBEAT PULSING YES BUTTON */}
          <div
            style={{
              transform: `scale(${yesScale})`,
              transformOrigin: 'center center',
            }}
            className="relative z-20 inline-block transition-transform duration-200"
          >
            <button
              id="yes-proposal-button"
              onClick={handleYesClick}
              className="animate-heartbeat group relative cursor-pointer inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-white shadow-lg shadow-rose-500/40 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all duration-200 ease-out"
            >
              <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-base sm:text-lg tracking-wide uppercase">
                YES! Absolutely Yes! 💖
              </span>
              <Heart className="w-5 h-5 fill-white text-white group-hover:scale-125 transition-transform" />
            </button>
          </div>

          {/* THE RUNAWAY NO BUTTON (Normal flow before dodge, fixed viewport floating after dodge) */}
          {!noPosition ? (
            <button
              id="no-proposal-button"
              ref={noButtonRef}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onPointerDown={moveNoButton}
              onClick={moveNoButton}
              className="cursor-pointer inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-300 shadow-sm transition-transform duration-150"
            >
              No... 🥺
            </button>
          ) : null}
        </div>

        {/* Footer romantic hint (Proposer secret: triple-click opens confidential activity report) */}
        <div
          onClick={() => {
            secretClickRef.current = (secretClickRef.current || 0) + 1;
            if (secretClickRef.current >= 3) {
              secretClickRef.current = 0;
              onOpenReport?.();
            }
          }}
          className="mt-8 text-xs text-rose-400/80 font-handwriting text-lg select-none cursor-default"
          title="From your love"
        >
          From {config.proposerName || 'Your Love'} with all my heart ♡
        </div>
      </div>

      {/* FIXED TELEPORTING RUNAWAY NO BUTTON (When dodged) */}
      {noPosition && (
        <button
          id="no-proposal-button-active"
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onPointerDown={moveNoButton}
          onClick={moveNoButton}
          style={{
            position: 'fixed',
            left: `${noPosition.x}px`,
            top: `${noPosition.y}px`,
            zIndex: 9999,
          }}
          className="cursor-pointer inline-flex items-center justify-center px-5 py-2.5 rounded-full font-medium text-slate-600 bg-white/95 backdrop-blur-md border-2 border-dashed border-rose-300 shadow-xl transition-all duration-150 ease-out hover:scale-90 select-none animate-bounce"
        >
          No... 🥺 ({dodgeCount})
        </button>
      )}
    </div>
  );
};
