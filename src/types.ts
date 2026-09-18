export type ChimeSoundType = 'celesta' | 'harp' | 'musicbox' | 'bells';

export interface ProposalConfig {
  partnerName: string;
  proposerName: string;
  customMessage: string;
  proposalType: 'marry' | 'girlfriend' | 'forever';
  metDate?: string;
  loveLetter?: string;
  chimeSound?: ChimeSoundType;
  anniversaryDate?: string;
  musicEnabled: boolean;
}

export type ProposalStage = 'question' | 'celebration_window' | 'love_contract';

export interface LoveMeterLevel {
  value: number;
  label: string;
  emoji: string;
  description: string;
}

