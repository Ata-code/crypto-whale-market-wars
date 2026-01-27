
import React from 'react';
import { CryptoCard } from './types';

export const INITIAL_HP = 100;

export const CRYPTO_CARDS: CryptoCard[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'BLUE_CHIP',
    power: 8,
    stability: 9,
    flavorText: 'The Digital Gold. Reliable, but moves like a tank.',
    color: 'bg-orange-500'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'LAYER_1',
    power: 7,
    stability: 7,
    flavorText: 'The world computer. Fuel for the ecosystem.',
    color: 'bg-indigo-500'
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    type: 'LAYER_1',
    power: 9,
    stability: 4,
    flavorText: 'Fast as light, fragile as glass. Network down?',
    color: 'bg-purple-500'
  },
  {
    id: 'doge',
    name: 'Dogecoin',
    symbol: 'DOGE',
    type: 'MEME',
    power: 12,
    stability: 2,
    flavorText: 'Much wow. Such pump. Very dump.',
    color: 'bg-yellow-500'
  },
  {
    id: 'pepe',
    name: 'Pepe',
    symbol: 'PEPE',
    type: 'MEME',
    power: 15,
    stability: 1,
    flavorText: 'The frog that conquered the charts. pure chaos.',
    color: 'bg-green-500'
  },
  {
    id: 'usdc',
    name: 'USDC',
    symbol: 'USDC',
    type: 'STABLECOIN',
    power: 1,
    stability: 15,
    flavorText: 'Steady through the storm. Boring, but safe.',
    color: 'bg-blue-400'
  },
  {
    id: 'aave',
    name: 'Aave',
    symbol: 'AAVE',
    type: 'DEFI',
    power: 6,
    stability: 6,
    flavorText: 'Liquidity is the lifeblood of decentralized markets.',
    color: 'bg-cyan-600'
  },
  {
    id: 'link',
    name: 'Chainlink',
    symbol: 'LINK',
    type: 'DEFI',
    power: 5,
    stability: 8,
    flavorText: 'Connecting reality to the blockchain.',
    color: 'bg-blue-700'
  }
];

export const ICONS = {
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  TrendingDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Zap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  )
};
