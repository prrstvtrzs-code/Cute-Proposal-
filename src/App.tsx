/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FloatingHearts } from './components/FloatingHearts';
import { ProposalCard } from './components/ProposalCard';
import { CelebrationWindow } from './components/CelebrationWindow';
import { CustomizerModal } from './components/CustomizerModal';
import { SecretReportModal } from './components/SecretReportModal';
import { StarTrail } from './components/StarTrail';
import { ProposalConfig } from './types';
import { sound } from './utils/audio';

const STORAGE_KEY = 'forever_proposal_config_v1';

export default function App() {
  const [config, setConfig] = useState<ProposalConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore localstorage errors
    }
    return {
      partnerName: 'My Beautiful Princess',
      proposerName: 'Your Forever Love',
      customMessage:
        "Every single moment with you is my favorite memory, and I never want this journey to end. You make my world infinitely brighter. Will you be mine forever? 💖✨",
      proposalType: 'forever',
      chimeSound: 'celesta',
      musicEnabled: true,
    };
  });

  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Check URL query parameters (e.g. ?report=true or ?admin=true) and secret hotkey (Shift + R)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('report') === 'true' || params.get('admin') === 'true' || params.get('secret') === '1') {
        setIsReportOpen(true);
      }
    } catch {
      // Ignore URL parsing errors
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + R or Alt + R opens the private partner telemetry report
      if (e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        setIsReportOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveConfig = (newConfig: ProposalConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // Storage safe ignore
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    if (!nextMuted) {
      sound.playRomanticChime(config.chimeSound || 'celesta');
    }
  };

  const handleYes = () => {
    // Open the new cute celebration window asking "How much do you love me?"
    setIsCelebrationOpen(true);
  };

  const handleReset = () => {
    setIsCelebrationOpen(false);
  };

  return (
    <main className="min-h-screen relative w-full flex flex-col justify-between overflow-x-hidden">
      {/* Subtle cursor star trail animation across entire app */}
      <StarTrail />

      {/* Dynamic Floating Hearts & Romantic Lights Ambiance */}
      <FloatingHearts />

      {/* Main Interactive Proposal Stage */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-6 px-4">
        <ProposalCard
          config={config}
          onYes={handleYes}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      </div>

      {/* "New Window" - The Cute Celebration & How Much Do You Love Me Modal */}
      {isCelebrationOpen && (
        <CelebrationWindow
          config={config}
          onClose={() => setIsCelebrationOpen(false)}
          onReset={handleReset}
        />
      )}

      {/* Personalization Drawer / Modal */}
      <CustomizerModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveConfig}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Confidential Proposer-Only Activity Telemetry Report */}
      <SecretReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        config={config}
      />
    </main>
  );
}
