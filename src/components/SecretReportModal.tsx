import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Heart,
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Eye,
  AlertCircle,
  Download,
  Info,
} from 'lucide-react';
import { activityTracker, ActivitySummary } from '../utils/activityTracker';
import { ProposalConfig } from '../types';

interface SecretReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProposalConfig;
}

export const SecretReportModal: React.FC<SecretReportModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [summary, setSummary] = useState<ActivitySummary>(activityTracker.getSummary());
  const [copied, setCopied] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Poll for updates every 1.5s while open (unless confirming reset)
  useEffect(() => {
    if (!isOpen || isConfirmingReset) return;
    setSummary(activityTracker.getSummary());

    const interval = setInterval(() => {
      setSummary(activityTracker.getSummary());
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, isConfirmingReset]);

  if (!isOpen) return null;

  const handleCopyReport = () => {
    const lines = [
      `💘 PROPOSAL ACTIVITY REPORT FOR ${config.partnerName.toUpperCase()}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `• Decision: ${summary.saidYes ? '💍 SAID YES! (Proposal Accepted)' : '⏳ Has not clicked Yes yet'}`,
      summary.saidYes && summary.secondsToSayYes
        ? `• Time to Say Yes: ${summary.secondsToSayYes} seconds after opening`
        : null,
      `• Dodge "No" Attempts: ${summary.dodgeCount} time${summary.dodgeCount === 1 ? '' : 's'}${
        summary.dodgeCount > 0 ? ` (She tried to run away but couldn't! 🏃‍♀️)` : ' (She went straight for YES!)'
      }`,
      `• Love-O-Meter Level: ${summary.isInfinity ? '∞ INFINITY%' : `${summary.finalLoveLevel}%`}`,
      `• Sealed with Kiss: ${summary.kissStamped ? 'Yes! Stamped a digital kiss 💋' : 'Not stamped yet'}`,
      `• Downloaded Keepsake: ${summary.keepsakeDownloaded ? 'Yes, saved keepsake to device 📥' : 'No'}`,
      `• Promises Active: ${summary.promisesCheckedCount} of 5 promises`,
      `• Total Actions Logged: ${summary.logs.length} interactions`,
      `• Last Active: ${new Date(summary.lastActiveAt).toLocaleTimeString()}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard?.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExecuteReset = () => {
    const fresh = activityTracker.clearLogs();
    setSummary(fresh);
    setIsConfirmingReset(false);
    setResetSuccessMessage('Activity log has been completely cleared! Ready for a fresh run.');
    setTimeout(() => {
      setResetSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div
        id="secret-report-dialog"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with Confidential Badge & Quick Reset */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Partner Activity Report
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Private • Proposer Eyes Only
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Live telemetry of what {config.partnerName || 'she'} did on your proposal page
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isConfirmingReset && (
              <button
                type="button"
                onClick={() => setIsConfirmingReset(true)}
                className="cursor-pointer text-xs font-semibold text-rose-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors inline-flex items-center gap-1.5 border border-white/10"
                title="Reset log so you have a fresh test"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Reset Log</span>
              </button>
            )}
            <button
              id="close-report-modal"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Reset Success Message Banner */}
          {resetSuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{resetSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setResetSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 cursor-pointer text-xs font-bold px-2 py-0.5"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Inline Reset Confirmation Warning Banner */}
          {isConfirmingReset && (
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-md animate-fadeIn flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <strong className="block text-xs font-bold text-rose-950">
                    Confirm Reset Log?
                  </strong>
                  <p className="text-xs text-rose-700">
                    This erases all tracked events and dodge attempts for a 100% clean slate.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(false)}
                  className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="cursor-pointer px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Yes, Reset Log Now</span>
                </button>
              </div>
            </div>
          )}
          {/* Top Status Banner */}
          {summary.saidYes ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl animate-bounce">
                  💍
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    SUCCESS! {config.partnerName} SAID YES! 💖
                  </h3>
                  <p className="text-xs text-rose-100">
                    Accepted in {summary.secondsToSayYes ?? 0}s after dodging {summary.dodgeCount} time{summary.dodgeCount === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
                  Official Status: Engaged/Beloved
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div className="text-xs">
                <strong className="block font-semibold text-sm">Waiting for her to click YES</strong>
                {summary.logs.length > 0
                  ? `She is currently browsing the page (${summary.logs.length} interactions logged).`
                  : 'She has not interacted with the proposal yet.'}
              </div>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Dodge Count */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                "No" Dodges
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-800">
                  {summary.dodgeCount}
                </span>
                <span className="text-xs text-rose-500 font-medium">tries</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">
                {summary.dodgeCount === 0 ? 'Surrendered immediately' : 'Tried to evade but failed!'}
              </p>
            </div>

            {/* Love-O-Meter */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Love Meter
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-rose-600">
                  {summary.isInfinity ? '∞' : `${summary.finalLoveLevel}%`}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">
                {summary.isInfinity ? 'Overclocked to Infinity' : 'Affection rating recorded'}
              </p>
            </div>

            {/* Sealed Kiss */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Kiss Stamped
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-slate-800">
                  {summary.kissStamped ? 'Sealed 💋' : 'No ❌'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">
                {summary.kissStamped ? 'Applied wax seal stamp' : 'Not pressed yet'}
              </p>
            </div>

            {/* Keepsake Downloaded */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Saved Image
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-slate-800">
                  {summary.keepsakeDownloaded ? 'Saved 📥' : 'No ⏳'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">
                {summary.keepsakeDownloaded ? 'Keepsake file downloaded' : 'Not downloaded yet'}
              </p>
            </div>
          </div>

          {/* Chronological Action Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>Chronological Event Feed ({summary.logs.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">Live Auto-Updating</span>
            </div>

            {summary.logs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">
                  No interactions recorded yet. As soon as she opens or touches the page, every action will appear here!
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {summary.logs.map((log) => {
                  let badgeColor = 'bg-slate-100 text-slate-700';
                  let icon = '•';

                  if (log.type === 'yes_clicked') {
                    badgeColor = 'bg-rose-100 text-rose-700 font-bold';
                    icon = '💍';
                  } else if (log.type === 'dodge_no') {
                    badgeColor = 'bg-amber-100 text-amber-800';
                    icon = '🏃';
                  } else if (log.type === 'kiss_stamped') {
                    badgeColor = 'bg-pink-100 text-pink-700';
                    icon = '💋';
                  } else if (log.type === 'overclock_infinity') {
                    badgeColor = 'bg-purple-100 text-purple-700';
                    icon = '🌌';
                  } else if (log.type === 'keepsake_downloaded') {
                    badgeColor = 'bg-emerald-100 text-emerald-700';
                    icon = '📥';
                  }

                  return (
                    <div key={log.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3">
                      <span className="text-base flex-shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeColor}`}>
                            {log.title}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                            {log.timeString} ({log.elapsedSeconds}s)
                          </span>
                        </div>
                        {log.detail && (
                          <p className="text-xs text-slate-600 mt-1 break-words">
                            {log.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Privacy explanation for proposer */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 flex items-start gap-2.5 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Why this is invisible to her:</strong> This report is stored locally on this device and can only be opened by you via the <em>Customize</em> menu, pressing <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[10px]">Shift+R</kbd>, or appending <code className="px-1 py-0.5 bg-white rounded border border-slate-300 font-mono text-[10px]">?report=true</code> to the URL.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {!isConfirmingReset ? (
            <button
              id="reset-log-button"
              type="button"
              onClick={() => setIsConfirmingReset(true)}
              className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors inline-flex items-center gap-1.5 border border-slate-200 hover:border-rose-200"
              title="Clear all recorded interactions to start fresh"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset Log</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-rose-600">Reset log?</span>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="cursor-pointer px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-2xs"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingReset(false)}
                className="cursor-pointer px-2 py-1 text-slate-500 hover:text-slate-700 text-[11px]"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs transition-transform active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
