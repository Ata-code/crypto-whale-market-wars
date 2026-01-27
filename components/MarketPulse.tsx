
import React from 'react';
import { MarketEvent } from '../types';
import { ICONS } from '../constants';

interface MarketPulseProps {
  event: MarketEvent | null;
  loading: boolean;
}

const MarketPulse: React.FC<MarketPulseProps> = ({ event, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl animate-pulse flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-1/4"></div>
          <div className="h-3 bg-slate-800 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const colorClass = event.effect === 'BULLISH' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                   event.effect === 'BEARISH' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' :
                   'text-slate-300 border-slate-500/30 bg-slate-500/10';

  return (
    <div className={`border p-4 rounded-xl flex items-center gap-4 card-transition ${colorClass}`}>
      <div className="text-3xl">
        {event.effect === 'BULLISH' ? <ICONS.TrendingUp /> : event.effect === 'BEARISH' ? <ICONS.TrendingDown /> : '⚖️'}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-bold uppercase tracking-widest text-sm">Market Pulse: {event.name}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-black/20 mono">
            Impact: x{event.impactMultiplier.toFixed(1)}
          </span>
        </div>
        <p className="text-sm opacity-90 italic">"{event.description}"</p>
      </div>
    </div>
  );
};

export default MarketPulse;
