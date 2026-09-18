import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Award,
  CheckCircle2,
  X,
  Minus,
  Maximize2,
  Share2,
  Download,
  RotateCcw,
  Check
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ProposalConfig } from '../types';
import { CuteMascot } from './CuteMascot';
import { FireworksOverlay } from './FireworksOverlay';
import { fireHeartConfetti } from '../utils/heartConfetti';
import { downloadProposalCardImage } from '../utils/downloadCard';
import { activityTracker } from '../utils/activityTracker';

interface CelebrationWindowProps {
  config: ProposalConfig;
  onReset: () => void;
  onClose: () => void;
}

const LOVE_LEVELS = [
  {
    min: 0,
    max: 20,
    title: "Suspiciously Low! 🤨",
    emoji: "🤏",
    quote: "Wait a second... only this much?! Did my runaway 'No' button hurt your feelings?!",
  },
  {
    min: 21,
    max: 45,
    title: "More than Sunday morning sleep 😴",
    emoji: "☕",
    quote: "A respectable amount! You'd wake up before 11 AM for me... maybe!",
  },
  {
    min: 46,
    max: 75,
    title: "More than all the fries & boba! 🍟🧋",
    emoji: "🍔",
    quote: "Now we're talking! Willing to share the last bite of dessert is true soulmate behavior!",
  },
  {
    min: 76,
    max: 95,
    title: "To the Moon, past Mars & back! 🚀✨",
    emoji: "🪐",
    quote: "Across galaxies, through black holes, and into infinity with extra cuddles!",
  },
  {
    min: 96,
    max: 100,
    title: "100% MAXIMUM SOULMATE CAPACITY! 💖💍",
    emoji: "👑",
    quote: "With every single heartbeat, forever and ever, officially and unconditionally!",
  },
];

export const CelebrationWindow: React.FC<CelebrationWindowProps> = ({
  config,
  onReset,
  onClose,
}) => {
  const [sliderValue, setSliderValue] = useState(85);
  const [isInfinity, setIsInfinity] = useState(false);
  const [isStamped, setIsStamped] = useState(false);
  const [activeTab, setActiveTab] = useState<'meter' | 'promises' | 'certificate'>('meter');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [hasConfirmedLevel, setHasConfirmedLevel] = useState(false);
  const lastHeartConfettiTime = React.useRef<number>(0);

  // Love promises toggles
  const [promises, setPromises] = useState([
    { id: 1, text: "Unlimited random hugs & forehead kisses whenever requested", checked: true },
    { id: 2, text: "Boyfriend is legally required to capture all spiders & bugs", checked: true },
    { id: 3, text: "Girlfriend may steal 25% to 80% of all restaurant french fries", checked: true },
    { id: 4, text: "Every fight must be resolved with snacks, cuddles, or boba", checked: true },
    { id: 5, text: "Holding hands in public is non-negotiable and 100% mandatory", checked: true },
  ]);

  const togglePromise = (id: number) => {
    sound.playHeartPop();
    const targetPromise = promises.find((p) => p.id === id);
    const nextChecked = targetPromise ? !targetPromise.checked : true;
    const nextPromises = promises.map((p) => (p.id === id ? { ...p, checked: nextChecked } : p));
    setPromises(nextPromises);
    const count = nextPromises.filter((p) => p.checked).length;
    if (targetPromise) {
      activityTracker.logPromiseToggle(targetPromise.text, nextChecked, count);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderValue(val);
    setIsInfinity(false);

    // Heart pop sound on steps
    if (val % 15 === 0) {
      sound.playHeartPop();
    }

    // Trigger romantic heart-shaped confetti when reaching high love values (>= 90%)
    if (val >= 90) {
      const now = Date.now();
      if (now - lastHeartConfettiTime.current > 1200) {
        lastHeartConfettiTime.current = now;
        sound.playRomanticChime(config.chimeSound || 'celesta');
        fireHeartConfetti({ originX: 0.5, originY: 0.4, count: 50 });
      }
    }

    // Log love meter adjustment
    const levelObj = LOVE_LEVELS.find((l) => val >= l.min && val <= l.max);
    activityTracker.logLoveMeter(val, levelObj?.title || `${val}%`);
  };

  const handleConfirmLoveLevel = () => {
    setShowFireworks(true);
    setHasConfirmedLevel(true);
    sound.playYesCelebration();

    // Log confirmed level
    activityTracker.logLoveLevelConfirmed(sliderValue, isInfinity);

    // Trigger romantic heart-shaped confetti bursts along with fireworks
    fireHeartConfetti({ originX: 0.5, originY: 0.45, count: 70 });

    // Trigger canvas confetti fireworks bursts
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.45 },
      colors: ['#FF1493', '#F43F5E', '#FFD700', '#A855F7', '#38BDF8'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.5 },
        colors: ['#E11D48', '#FFD700', '#F472B6'],
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.5 },
        colors: ['#E11D48', '#FFD700', '#F472B6'],
      });
    }, 300);
  };

  const handleOverclockInfinity = () => {
    setIsInfinity(true);
    setSliderValue(100);
    activityTracker.logInfinity();
    fireHeartConfetti({ originX: 0.5, originY: 0.45, count: 80 });
    handleConfirmLoveLevel();
  };

  const handleStampKiss = () => {
    setIsStamped(true);
    sound.playRomanticChime();
    activityTracker.logKissStamp();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#E11D48', '#FDA4AF'],
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    sound.playHeartPop();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Get current level data
  const currentLevel = isInfinity
    ? {
        title: "INFINITY × 100000000%! 🌌💥",
        emoji: "💥",
        quote: "CRITICAL ALERT: Love levels have officially shattered human instruments! The universe cannot contain this much adoration! 💍✨",
      }
    : LOVE_LEVELS.find((l) => sliderValue >= l.min && sliderValue <= l.max) || LOVE_LEVELS[4];

  return (
    <div
      id="celebration-window-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300"
    >
      {/* OS Styled Romantic Window */}
      <div
        id="celebration-window-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-rose-300 overflow-hidden flex flex-col my-auto transition-all"
      >
        {/* Fireworks Animation Overlay triggered on love level confirmation */}
        <FireworksOverlay
          active={showFireworks}
          onComplete={() => setShowFireworks(false)}
          duration={3500}
        />

        {/* Window Title Bar */}
        <div className="bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 px-4 py-2.5 border-b border-rose-300 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-rose-400 hover:bg-rose-500 flex items-center justify-center text-white text-[9px] transition-colors cursor-pointer"
              title="Close window"
            >
              <X className="w-2.5 h-2.5" />
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-300 flex items-center justify-center text-amber-800 text-[9px]">
              <Minus className="w-2 h-2" />
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-300 flex items-center justify-center text-emerald-800 text-[9px]">
              <Maximize2 className="w-2 h-2" />
            </div>
            <span className="ml-2 text-xs font-semibold text-rose-900 flex items-center gap-1">
              <span>💖 Love_Confirmation_Window_v2.0.exe</span>
            </span>
          </div>

          <span className="text-[11px] font-medium text-rose-700 bg-white/70 px-2.5 py-0.5 rounded-full border border-rose-200">
            Status: Proposal Accepted! 💍
          </span>
        </div>

        {/* Window Content */}
        <div className="p-4 sm:p-8 overflow-y-auto max-h-[82vh]">
          {/* Hero Celebration Banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-rose-50 rounded-full mb-2 border border-rose-200 shadow-inner">
              <CuteMascot mood="ecstatic" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-rose-900 tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
              <span>SHE SAID YES!</span>
              <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-rose-600 font-medium mt-1">
              Best decision of your life, {config.partnerName || 'my love'}! Now for the official question...
            </p>
          </div>

          {/* Navigation Tabs within Window */}
          <div className="flex border-b border-rose-200 mb-6 gap-2 sm:gap-4 justify-center">
            <button
              onClick={() => {
                setActiveTab('meter');
                sound.playHeartPop();
              }}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'meter'
                  ? 'text-rose-600 border-b-2 border-rose-500'
                  : 'text-slate-500 hover:text-rose-400'
              }`}
            >
              1. How Much Do You Love Me?
            </button>
            <button
              onClick={() => {
                setActiveTab('promises');
                sound.playHeartPop();
              }}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'promises'
                  ? 'text-rose-600 border-b-2 border-rose-500'
                  : 'text-slate-500 hover:text-rose-400'
              }`}
            >
              2. Cute Proposal Terms
            </button>
            <button
              onClick={() => {
                setActiveTab('certificate');
                sound.playRomanticChime();
              }}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'certificate'
                  ? 'text-rose-600 border-b-2 border-rose-500'
                  : 'text-slate-500 hover:text-rose-400'
              }`}
            >
              3. Official Love Certificate
            </button>
          </div>

          {/* TAB 1: HOW MUCH DO YOU LOVE ME? (THE LOVE-O-METER) */}
          {activeTab === 'meter' && (
            <div id="how-much-love-section" className="space-y-6">
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  Mandatory Verification Question
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
                  How much do you love me?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust the love calibration slider to declare your exact feelings:
                </p>

                {/* Meter Display Gauge */}
                <div className="mt-5 mb-4 p-4 rounded-xl bg-white border border-rose-100 shadow-sm">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl sm:text-5xl">{currentLevel.emoji}</span>
                    <div className="text-left">
                      <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
                        {isInfinity ? '∞ INFINITY%' : `${sliderValue}%`}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700">
                        {currentLevel.title}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 italic bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                    "{currentLevel.quote}"
                  </p>
                </div>

                {/* Range Slider */}
                <div className="px-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="w-full h-3 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="flex justify-between text-[11px] text-rose-500/80 font-semibold mt-1">
                    <span>A little bit 🤏</span>
                    <span>A whole bunch 💖</span>
                    <span>Maximum 100% 🚀</span>
                  </div>
                </div>

                {/* Actions: Confirm Love Level (Triggers Fireworks) & Infinity Mode */}
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    id="confirm-love-level-button"
                    onClick={handleConfirmLoveLevel}
                    className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '3s' }} />
                    <span>Confirm My Love Level! 🎆</span>
                    <Heart className="w-4 h-4 fill-white text-white" />
                  </button>

                  <button
                    id="overclock-infinity-button"
                    onClick={handleOverclockInfinity}
                    className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>OVERCLOCK TO INFINITY! 🚀</span>
                  </button>
                </div>

                {hasConfirmedLevel && (
                  <div
                    id="love-confirmed-banner"
                    className="mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Love Level Confirmed: {isInfinity ? '∞ INFINITY%' : `${sliderValue}%`}! Fireworks lit in your honor! 🎆💖</span>
                  </div>
                )}
              </div>

              {/* Next Step Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setActiveTab('promises');
                    sound.playRomanticChime();
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <span>Review Proposal Promises</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROPOSAL TERMS & PROMISES */}
          {activeTab === 'promises' && (
            <div id="proposal-promises-section" className="space-y-4">
              <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-500" />
                  <span>The Official Relationship Contract Clauses</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  By accepting this proposal, both parties delightfully consent to the following terms:
                </p>

                <div className="space-y-2.5">
                  {promises.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => togglePromise(item.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        item.checked
                          ? 'bg-white border-rose-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                          item.checked
                            ? 'bg-rose-500 text-white'
                            : 'border-2 border-slate-300 bg-white'
                        }`}
                      >
                        {item.checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 font-medium">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveTab('meter')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Back to Love Meter
                </button>
                <button
                  onClick={() => {
                    setActiveTab('certificate');
                    sound.playRomanticChime();
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <span>Sign Love Certificate</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL LOVE CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div id="love-certificate-section" className="space-y-6">
              <div className="relative bg-amber-50/50 border-4 border-double border-amber-300 rounded-2xl p-6 text-center shadow-md">
                {/* Decorative border ornaments */}
                <div className="text-amber-500 text-xs font-serif mb-1">
                  ✦ ✧ ✦ ETERNAL BOND OF LOVE & PROPOSAL ✦ ✧ ✦
                </div>

                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-900 tracking-wide">
                  Certificate of Forever Love
                </h3>

                <p className="text-xs text-amber-800/80 mt-1 max-w-sm mx-auto">
                  This certifies that on this momentous day, the proposal was accepted with great joy, laughter, and endless devotion.
                </p>

                {/* Partners' Names */}
                <div className="my-6 py-4 border-y border-amber-200/80 grid grid-cols-2 gap-4 items-center">
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Proposed By
                    </div>
                    <div className="text-lg sm:text-xl font-script font-bold text-rose-600 mt-0.5">
                      {config.proposerName || 'Your Devoted Partner'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Accepted By
                    </div>
                    <div className="text-lg sm:text-xl font-script font-bold text-rose-600 mt-0.5">
                      {config.partnerName || 'The Love of My Life'}
                    </div>
                  </div>
                </div>

                {/* Certified Love Rating */}
                <div className="mb-6 inline-flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full border border-amber-200 text-xs font-medium text-amber-900">
                  <span>Registered Love Quotient:</span>
                  <span className="font-bold text-rose-600">
                    {isInfinity ? 'INFINITY × 10^∞%' : `${sliderValue}% (Maximum Affection)`}
                  </span>
                </div>

                {/* Wax Kiss Stamp Section */}
                <div className="flex flex-col items-center justify-center">
                  {isStamped ? (
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-600 text-white font-serif font-bold text-[11px] shadow-lg border-4 border-rose-300 animate-in zoom-in-50 duration-300">
                      <div className="text-center leading-tight">
                        <div>SEALED</div>
                        <div>WITH A</div>
                        <div className="text-sm">💋</div>
                        <div>FOREVER</div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleStampKiss}
                      className="cursor-pointer group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-amber-100/50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-400 flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:border-rose-600 transition-transform">
                        <Heart className="w-7 h-7 fill-rose-100 text-rose-500" />
                      </div>
                      <span className="text-xs font-bold text-rose-700 underline">
                        Click to Stamp with a Kiss 💋
                      </span>
                    </button>
                  )}
                  <div className="text-[10px] text-slate-400 mt-2">
                    Witnessed by Cupid, The Stars, & Pure Destiny
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={onReset}
                  className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Proposal Again</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 text-xs font-semibold shadow-xs transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Copy Link to Send Her</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      sound.playRomanticChime(config.chimeSound || 'celesta');
                      activityTracker.logKeepsakeDownload('Celebration Certificate');
                      downloadProposalCardImage(config, 'celebration', {
                        sliderValue,
                        isInfinity,
                      });
                    }}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-400 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold shadow-xs transition-transform active:scale-95"
                    title="Download certificate keepsake as a PNG image"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-600" />
                    <span>Download Image</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
