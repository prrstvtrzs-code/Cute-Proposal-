export interface ActivityLogItem {
  id: string;
  timestamp: number;
  timeString: string;
  type:
    | 'page_opened'
    | 'dodge_no'
    | 'yes_clicked'
    | 'love_meter_changed'
    | 'love_level_confirmed'
    | 'overclock_infinity'
    | 'promise_toggled'
    | 'kiss_stamped'
    | 'keepsake_downloaded'
    | 'link_copied'
    | 'tab_changed';
  title: string;
  detail?: string;
  elapsedSeconds: number;
}

export interface ActivitySummary {
  sessionStartedAt: number;
  lastActiveAt: number;
  saidYes: boolean;
  yesTimestamp?: number;
  secondsToSayYes?: number;
  dodgeCount: number;
  lastDodgeMessage?: string;
  finalLoveLevel: number;
  isInfinity: boolean;
  kissStamped: boolean;
  keepsakeDownloaded: boolean;
  promisesCheckedCount: number;
  logs: ActivityLogItem[];
}

const STORAGE_KEY = 'forever_proposal_partner_activity_v1';
let sessionStartTime = Date.now();

export const activityTracker = {
  getSummary(): ActivitySummary {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore JSON error
    }

    // Default empty summary
    return {
      sessionStartedAt: sessionStartTime,
      lastActiveAt: Date.now(),
      saidYes: false,
      dodgeCount: 0,
      finalLoveLevel: 85,
      isInfinity: false,
      kissStamped: false,
      keepsakeDownloaded: false,
      promisesCheckedCount: 5,
      logs: [],
    };
  },

  log(
    type: ActivityLogItem['type'],
    title: string,
    detail?: string,
    updates?: Partial<ActivitySummary>
  ) {
    try {
      const current = this.getSummary();
      const now = Date.now();
      if (!current.sessionStartedAt) {
        current.sessionStartedAt = sessionStartTime;
      }
      const elapsedSeconds = Math.max(0, Math.floor((now - current.sessionStartedAt) / 1000));

      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const newLog: ActivityLogItem = {
        id: `${now}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: now,
        timeString: timeFormatter.format(new Date(now)),
        type,
        title,
        detail,
        elapsedSeconds,
      };

      const updated: ActivitySummary = {
        ...current,
        ...updates,
        lastActiveAt: now,
        logs: [newLog, ...current.logs].slice(0, 80), // keep recent 80 events
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return null;
    }
  },

  initSession() {
    const current = this.getSummary();
    if (current.logs.length === 0) {
      this.log('page_opened', 'Opened Proposal Page', 'She just loaded the proposal on her screen! 💖');
    }
  },

  logDodge(count: number, message: string) {
    const current = this.getSummary();
    this.log(
      'dodge_no',
      `Tried to say 'No' (Attempt #${count})`,
      `She chased or clicked 'No'. Message shown: "${message}"`,
      { dodgeCount: Math.max(current.dodgeCount, count), lastDodgeMessage: message }
    );
  },

  logYes(dodgeCount: number) {
    const now = Date.now();
    const current = this.getSummary();
    const elapsed = Math.max(1, Math.floor((now - current.sessionStartedAt) / 1000));

    this.log(
      'yes_clicked',
      'SHE SAID YES! 💍🎉',
      `Accepted after ${dodgeCount} dodge attempt${dodgeCount === 1 ? '' : 's'} (${elapsed}s total time on page)`,
      {
        saidYes: true,
        yesTimestamp: now,
        secondsToSayYes: elapsed,
        dodgeCount,
      }
    );
  },

  logLoveMeter(value: number, levelTitle: string) {
    this.log(
      'love_meter_changed',
      `Set Love-O-Meter to ${value}%`,
      `Affection rating: "${levelTitle}"`,
      { finalLoveLevel: value }
    );
  },

  logInfinity() {
    this.log(
      'overclock_infinity',
      'Overclocked to ∞ INFINITY%! 🌌💥',
      'She tapped the Overclock button to send love beyond human measurement!',
      { isInfinity: true, finalLoveLevel: 100 }
    );
  },

  logLoveLevelConfirmed(value: number, isInf: boolean) {
    this.log(
      'love_level_confirmed',
      `Confirmed Affection Level: ${isInf ? '∞ Infinity' : `${value}%`}`,
      'Locked in her official love certificate score.'
    );
  },

  logPromiseToggle(text: string, checked: boolean, totalChecked: number) {
    this.log(
      'promise_toggled',
      `${checked ? 'Accepted' : 'Unchecked'} Promise`,
      `"${text}" (${totalChecked} promises active)`,
      { promisesCheckedCount: totalChecked }
    );
  },

  logKissStamp() {
    this.log(
      'kiss_stamped',
      'Stamped a Kiss on Certificate! 💋',
      'She clicked the red wax seal to stamp her digital kiss.',
      { kissStamped: true }
    );
  },

  logKeepsakeDownload(stage: string) {
    this.log(
      'keepsake_downloaded',
      'Downloaded Keepsake Image 📥',
      `Saved the high-resolution proposal card image (${stage}) to her device.`,
      { keepsakeDownloaded: true }
    );
  },

  clearLogs(): ActivitySummary {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStartTime = Date.now();
    } catch {
      // Ignore
    }
    return {
      sessionStartedAt: sessionStartTime,
      lastActiveAt: sessionStartTime,
      saidYes: false,
      dodgeCount: 0,
      finalLoveLevel: 85,
      isInfinity: false,
      kissStamped: false,
      keepsakeDownloaded: false,
      promisesCheckedCount: 5,
      logs: [],
    };
  },
};
