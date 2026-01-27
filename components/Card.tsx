
import React from 'react';
import { CryptoCard } from '../types';
import { ICONS } from '../constants';

interface CardProps {
  card: CryptoCard;
  onClick?: (card: CryptoCard) => void;
  disabled?: boolean;
  isHidden?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, disabled, isHidden }) => {
  if (isHidden) {
    return (
      <div className="w-32 h-48 bg-slate-800 rounded-xl border-4 border-slate-700 flex items-center justify-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-transparent"></div>
        <div className="text-4xl font-bold text-slate-600 rotate-12 select-none">WHALE</div>
      </div>
    );
  }

  return (
    <button
      onClick={() => !disabled && onClick?.(card)}
      disabled={disabled}
      className={`
        w-32 h-48 rounded-xl border-2 p-2 flex flex-col justify-between 
        card-transition shadow-xl relative group overflow-hidden
        ${card.color} border-white/20 hover:scale-105 hover:-translate-y-2
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="absolute top-0 right-0 p-1 opacity-20">
         <ICONS.Zap />
      </div>

      <div className="z-10">
        <div className="flex justify-between items-start">
          <span className="mono font-bold text-lg leading-none">{card.symbol}</span>
          <span className="text-[10px] uppercase font-bold px-1 bg-black/30 rounded">{card.type.replace('_', ' ')}</span>
        </div>
        <h3 className="text-xs font-bold truncate mt-1">{card.name}</h3>
      </div>

      <div className="flex-1 flex items-center justify-center py-2">
         <div className="text-3xl font-black drop-shadow-md">
            {card.power}
         </div>
      </div>

      <div className="z-10">
        <div className="flex justify-between text-[10px] mb-1">
          <div className="flex items-center gap-0.5">
            <ICONS.TrendingUp /> {card.power}
          </div>
          <div className="flex items-center gap-0.5">
            <ICONS.Shield /> {card.stability}
          </div>
        </div>
        <p className="text-[8px] leading-tight opacity-90 italic line-clamp-2">
          "{card.flavorText}"
        </p>
      </div>
    </button>
  );
};

export default Card;
