import React, { useState } from 'react';
import { X, Heart, Sparkles, Check, Volume2, Music, Lock, RotateCcw } from 'lucide-react';
import { ProposalConfig, ChimeSoundType } from '../types';
import { sound } from '../utils/audio';
import { activityTracker } from '../utils/activityTracker';

interface CustomizerModalProps {
  config: ProposalConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: ProposalConfig) => void;
  onOpenReport?: () => void;
}

const CHIME_OPTIONS: { id: ChimeSoundType; name: string; icon: string; desc: string }[] = [
  { id: 'celesta', name: 'Celesta Sparkle', icon: '✨', desc: 'Airy, magical starlight shimmer' },
  { id: 'harp', name: 'Harp Arpeggio', icon: '🎶', desc: 'Warm, sweeping romantic harp cascade' },
  { id: 'musicbox', name: 'Music Box Lullaby', icon: '🧸', desc: 'Sweet, crystal music box notes' },
  { id: 'bells', name: 'Angelic Bells', icon: '🔔', desc: 'Resonant, soulful cathedral chime' },
];

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
  onOpenReport,
}) => {
  const [partnerName, setPartnerName] = useState(config.partnerName);
  const [proposerName, setProposerName] = useState(config.proposerName);
  const [customMessage, setCustomMessage] = useState(config.customMessage);
  const [proposalType, setProposalType] = useState<ProposalConfig['proposalType']>(config.proposalType);
  const [chimeSound, setChimeSound] = useState<ChimeSoundType>(config.chimeSound || 'celesta');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const activitySummary = activityTracker.getSummary();

  const handleQuickResetLog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    activityTracker.clearLogs();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handlePreviewChime = (type: ChimeSoundType, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playRomanticChime(type);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playRomanticChime(chimeSound);
    onSave({
      ...config,
      partnerName: partnerName.trim() || 'My Love',
      proposerName: proposerName.trim() || 'Your Forever Partner',
      customMessage: customMessage.trim(),
      proposalType,
      chimeSound,
    });
    onClose();
  };

  return (
    <div
      id="customizer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
    >
      <div
        id="customizer-modal-content"
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-rose-200 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-rose-50 px-5 py-3.5 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Personalize Your Proposal Experience</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Her Name / Nickname
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g. Maya, Princess, Beautiful"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name / Nickname
              </label>
              <input
                type="text"
                value={proposerName}
                onChange={(e) => setProposerName(e.target.value)}
                placeholder="e.g. Harmeet, Your Boyfriend"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              />
            </div>
          </div>

          {/* Romantic Chime Sound Effect Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-rose-500" />
              <span>Romantic Chime Sound Effect</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CHIME_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setChimeSound(opt.id);
                    sound.playRomanticChime(opt.id);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    chimeSound === opt.id
                      ? 'border-rose-500 bg-rose-50/80 shadow-xs'
                      : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{opt.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>{opt.name}</span>
                        {chimeSound === opt.id && <span className="text-rose-500 text-[10px]">● Active</span>}
                      </div>
                      <div className="text-[10px] text-slate-500">{opt.desc}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handlePreviewChime(opt.id, e)}
                    className="p-1.5 rounded-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
                    title={`Preview ${opt.name}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proposal Headline Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'forever', label: 'Be Mine Forever 💖' },
                { id: 'girlfriend', label: 'Girlfriend 💕' },
                { id: 'marry', label: 'Marry Me 💍' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setProposalType(opt.id as ProposalConfig['proposalType'])}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    proposalType === opt.id
                      ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Card Message
            </label>
            <textarea
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your sweet message here..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
            />
          </div>

          <div className="pt-2 flex flex-wrap justify-between items-center border-t border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              {onOpenReport && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReport();
                  }}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-300 text-xs font-semibold shadow-2xs transition-colors"
                  title="View confidential live log of what she did"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Partner Activity Report</span>
                  {activitySummary.logs.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {activitySummary.logs.length}
                    </span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleQuickResetLog}
                className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 text-xs font-medium hover:bg-rose-50 transition-colors"
                title="Clear all recorded test clicks"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>{resetSuccess ? 'Log Reset! ✓' : 'Reset Log'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Update</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
