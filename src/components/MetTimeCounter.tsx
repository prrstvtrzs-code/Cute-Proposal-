import React, { useState, useEffect } from 'react';
import { Clock, Heart, Calendar } from 'lucide-react';

interface MetTimeCounterProps {
  startDateStr?: string;
  partnerName?: string;
}

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const MetTimeCounter: React.FC<MetTimeCounterProps> = ({
  startDateStr = '2023-08-15',
  partnerName,
}) => {
  const [elapsed, setElapsed] = useState<TimeElapsed>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      // Parse startDateStr or default
      const start = new Date(startDateStr).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDateStr]);

  return (
    <div
      id="time-since-met-counter"
      className="my-3 inline-flex flex-col items-center p-2.5 sm:px-4 sm:py-2 bg-rose-50/80 hover:bg-rose-50 border border-rose-200/90 rounded-2xl shadow-xs transition-all backdrop-blur-xs max-w-full"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600/90 mb-1">
        <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" />
        <span>Time Since We First Met</span>
        <Clock className="w-3 h-3 text-rose-400" />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 font-mono text-xs sm:text-sm font-bold">
        <span className="bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs text-rose-700">
          {elapsed.days} <span className="text-[10px] font-sans font-normal text-slate-500">days</span>
        </span>
        <span className="text-rose-400 font-bold">:</span>
        <span className="bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs text-rose-700">
          {String(elapsed.hours).padStart(2, '0')} <span className="text-[10px] font-sans font-normal text-slate-500">hrs</span>
        </span>
        <span className="text-rose-400 font-bold">:</span>
        <span className="bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs text-rose-700">
          {String(elapsed.minutes).padStart(2, '0')} <span className="text-[10px] font-sans font-normal text-slate-500">mins</span>
        </span>
        <span className="text-rose-400 font-bold">:</span>
        <span className="bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs text-rose-700 text-amber-600">
          {String(elapsed.seconds).padStart(2, '0')} <span className="text-[10px] font-sans font-normal text-slate-500">secs</span>
        </span>
      </div>

      <div className="text-[10px] text-rose-500/80 font-medium mt-1 italic">
        "Every single second with you has been pure magic ✨"
      </div>
    </div>
  );
};
