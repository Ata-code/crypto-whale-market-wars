
export type CardType = 'BLUE_CHIP' | 'DEFI' | 'MEME' | 'LAYER_1' | 'STABLECOIN';

export interface CryptoCard {
  id: string;
  name: string;
  symbol: string;
  type: CardType;
  power: number;      // Pump potential
  stability: number;  // Resilience against crashes
  flavorText: string;
  color: string;
}

export interface MarketEvent {
  name: string;
  description: string;
  effect: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impactMultiplier: number;
}

export interface GameState {
  playerHP: number;
  opponentHP: number;
  playerHand: CryptoCard[];
  opponentHand: CryptoCard[];
  currentTurn: 'PLAYER' | 'OPPONENT';
  marketEvent: MarketEvent | null;
  history: string[];
  isGameOver: boolean;
  winner: 'PLAYER' | 'OPPONENT' | null;
}
