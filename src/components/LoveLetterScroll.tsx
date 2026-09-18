import React, { useState } from 'react';
import { X, Heart, Feather, Edit3, Check, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface LoveLetterScrollProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  proposerName: string;
  initialLetter?: string;
  onSaveLetter: (letter: string) => void;
}

const DEFAULT_LETTER_TEXT = `My Dearest,

From the very first moment our paths crossed, my world turned into color. 
You are the warmth on my coldest days, the laughter in my quiet moments, and the sweetest dream I never have to wake up from.

Thank you for every smile you've given me, every glance across the room, and every gentle touch that makes time stand still. I promise to cherish you, laugh with you through life's silly quirks, and stand by your side through every single sunrise and sunset.

You are my heart, my anchor, and my favorite adventure.
Will you be mine forever and always?

With all the love in my soul,
Forever Yours ♡`;

export const LoveLetterScroll: React.FC<LoveLetterScrollProps> = ({
  isOpen,
  onClose,
  partnerName,
  proposerName,
  initialLetter,
  onSaveLetter,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [letterContent, setLetterContent] = useState(initialLetter || DEFAULT_LETTER_TEXT);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveLetter(letterContent);
    setIsEditing(false);
    setIsSavedRecently(true);
    sound.playRomanticChime();
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  return (
    <div
      id="love-letter-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300"
    >
      <div
        id="love-letter-scroll-wrapper"
        className="relative w-full max-w-xl mx-auto my-auto flex flex-col items-center animate-in zoom-in-95 duration-400"
      >
        {/* Top Scroll Roller / Dowel */}
        <div className="w-[94%] sm:w-[96%] h-6 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-950 rounded-full shadow-lg border-y border-amber-600 flex items-center justify-between px-3 z-20">
          <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-inner border border-amber-800" />
          <div className="h-1 flex-1 mx-4 bg-amber-600/30 rounded-full" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-inner border border-amber-800" />
        </div>

        {/* Scroll Parchment Body */}
        <div
          id="parchment-body"
          className="relative w-full -mt-2.5 -mb-2.5 bg-[#FFFDF5] text-amber-950 px-6 sm:px-10 py-8 shadow-2xl border-x-4 border-amber-200/90 overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(#F5E6CA 1px, transparent 1px), radial-gradient(#F5E6CA 1px, #FFFDF5 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
            boxShadow: 'inset 0 0 35px rgba(217, 119, 6, 0.12), 0 20px 40px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Subtle Vintage Floral & Heart Corner Stamps */}
          <div className="absolute top-4 left-4 text-amber-700/25 text-2xl select-none font-serif">❦</div>
          <div className="absolute top-4 right-4 text-amber-700/25 text-2xl select-none font-serif">❧</div>
          <div className="absolute bottom-4 left-4 text-amber-700/25 text-2xl select-none font-serif">❧</div>
          <div className="absolute bottom-4 right-4 text-amber-700/25 text-2xl select-none font-serif">❦</div>

          {/* Close button in parchment style */}
          <button
            id="close-letter-button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-1.5 rounded-full text-amber-800/60 hover:text-amber-900 hover:bg-amber-100/70 transition-colors cursor-pointer"
            title="Roll up letter"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="text-center mb-6 border-b border-amber-200/80 pb-3">
            <div className="inline-flex items-center gap-2 text-rose-600 font-script text-3xl sm:text-4xl font-bold drop-shadow-xs">
              <Feather className="w-6 h-6 text-amber-700 -rotate-45" />
              <span>A Letter From My Heart</span>
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
            <p className="text-xs font-serif tracking-widest uppercase text-amber-800/70 mt-1">
              For {partnerName || 'My Love'} • Written by {proposerName || 'Forever Yours'}
            </p>
          </div>

          {/* Scroll Content: View or Edit Mode */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-serif text-amber-800/80">
                <span className="flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Pen your deepest thoughts & memories:</span>
                </span>
                <span>{letterContent.length} characters</span>
              </div>

              <textarea
                rows={11}
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                placeholder="Pour your heart onto this scroll..."
                className="w-full p-4 rounded-xl font-handwriting text-xl sm:text-2xl text-amber-950 bg-amber-50/50 border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 leading-relaxed resize-none shadow-inner"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/60 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-gradient-to-r from-rose-600 to-amber-700 text-white text-xs font-bold shadow-md hover:from-rose-700 hover:to-amber-800 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Seal & Save Scroll</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Handwritten text body with calligraphic font */}
              <div
                id="letter-scroll-text"
                className="font-handwriting text-xl sm:text-2xl text-amber-950 leading-relaxed whitespace-pre-line tracking-wide drop-shadow-xs px-2"
              >
                {letterContent}
              </div>

              {/* Romantic Wax Seal Stamp */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-200/80">
                <div className="flex items-center gap-3">
                  {/* Wax Seal */}
                  <div className="w-12 h-12 rounded-full bg-rose-700 border-2 border-rose-900 shadow-md flex items-center justify-center text-white font-serif text-[10px] font-bold ring-2 ring-rose-400/40 select-none">
                    <Heart className="w-6 h-6 fill-white text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-script text-xl text-rose-900 font-bold">
                      Sealed with eternal devotion
                    </div>
                    <div className="text-[10px] font-serif uppercase tracking-widest text-amber-700/80">
                      Unbreakable Love Promise
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      sound.playHeartPop();
                    }}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 hover:bg-amber-200/80 text-amber-900 border border-amber-300 text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Love Letter</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playRomanticChime();
                      onClose();
                    }}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-transform active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Cherish Forever</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isSavedRecently && (
            <div className="mt-3 p-2 text-center text-xs font-bold text-emerald-800 bg-emerald-100/90 rounded-lg border border-emerald-300 animate-in fade-in">
              ✨ Your love letter has been sealed and saved to this proposal!
            </div>
          )}
        </div>

        {/* Bottom Scroll Roller / Dowel */}
        <div className="w-[94%] sm:w-[96%] h-6 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-950 rounded-full shadow-lg border-y border-amber-600 flex items-center justify-between px-3 z-20">
          <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-inner border border-amber-800" />
          <div className="h-1 flex-1 mx-4 bg-amber-600/30 rounded-full" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-inner border border-amber-800" />
        </div>
      </div>
    </div>
  );
};
