// Web Audio API synthesizer for romantic chimes, evasive sounds, and celebration melodies

class SoundFX {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Playful dodge/boing sound when the "No" button escapes
  public playDodge() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      // Pitch slide up quickly like a cartoon boing / slip
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore audio failure if user has not interacted
    }
  }

  // Soft heart pop
  public playHeartPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio error safe ignore
    }
  }

  // Romantic arpeggio chime (celesta/harp)
  public playRomanticChime(type: 'celesta' | 'harp' | 'musicbox' | 'bells' = 'celesta') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (type === 'harp') {
        // Cascading harp arpeggio: C4, E4, G4, C5, E5, G5, C6
        const harpNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        harpNotes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          const start = this.ctx.currentTime + idx * 0.07;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.18, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.85);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.9);
        });
      } else if (type === 'musicbox') {
        // Music box: bright crystalline plucks with delicate double harmonic
        const musicBoxNotes = [587.33, 739.99, 880.00, 1174.66, 1318.51];
        musicBoxNotes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const start = this.ctx.currentTime + idx * 0.1;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.16, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.65);
        });
      } else if (type === 'bells') {
        // Angelic church / wind chime bells
        const bellNotes = [440.00, 554.37, 659.25, 880.00];
        bellNotes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const start = this.ctx.currentTime + idx * 0.16;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.24, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 1.25);
        });
      } else {
        // Default celesta sparkle
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
        notes.forEach((freq, index) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const start = this.ctx.currentTime + index * 0.08;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.18, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.75);
        });
      }
    } catch {
      // Ignore audio error
    }
  }

  // Celebratory fanfare when YES is clicked
  public playYesCelebration() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Chord sequence: G4 -> C5 -> E5 -> G5 -> C6 high flourish
      const notes = [
        { freq: 392.00, delay: 0.0, dur: 0.18 },
        { freq: 523.25, delay: 0.15, dur: 0.18 },
        { freq: 659.25, delay: 0.30, dur: 0.22 },
        { freq: 783.99, delay: 0.45, dur: 0.35 },
        { freq: 1046.50, delay: 0.65, dur: 0.8 }
      ];

      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const start = this.ctx.currentTime + n.delay;
        osc.frequency.setValueAtTime(n.freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + n.dur + 0.05);
      });
    } catch {
      // Ignore audio error
    }
  }
}

export const sound = new SoundFX();
