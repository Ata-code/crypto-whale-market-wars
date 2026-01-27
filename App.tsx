
import React, { useState, useEffect, useCallback } from 'react';
import sdk from "@farcaster/frame-sdk";
import { CryptoCard, GameState, MarketEvent } from './types';
import { CRYPTO_CARDS, INITIAL_HP, ICONS } from './constants';
import { fetchMarketEvent } from './services/geminiService';
import { synth } from './services/audioService';
import Card from './components/Card';
import MarketPulse from './components/MarketPulse';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerHP: INITIAL_HP,
    opponentHP: INITIAL_HP,
    playerHand: [],
    opponentHand: [],
    currentTurn: 'PLAYER',
    marketEvent: null,
    history: ['Welcome to the Whale Wars. Build your portfolio.'],
    isGameOver: false,
    winner: null,
  });

  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isFrameReady, setIsFrameReady] = useState(false);

  // Farcaster Frame SDK Initialization
  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.actions.ready();
        setIsFrameReady(true);
      } catch (e) {
        console.error("Not in a Farcaster context or SDK failed to load", e);
        setIsFrameReady(true); // Fallback for browser testing
      }
    };
    initFrame();
  }, []);

  const drawCards = (count: number): CryptoCard[] => {
    const shuffled = [...CRYPTO_CARDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const triggerNewMarketEvent = async () => {
    setIsLoadingEvent(true);
    try {
      const event = await fetchMarketEvent();
      setGameState(prev => ({
        ...prev,
        marketEvent: event,
        history: [`Market Alert: ${event.name}!`, ...prev.history.slice(0, 5)]
      }));
    } catch (err) {
      console.error("Error updating market event", err);
    } finally {
      setIsLoadingEvent(false);
    }
  };

  const initGame = useCallback(() => {
    setGameState({
      playerHP: INITIAL_HP,
      opponentHP: INITIAL_HP,
      playerHand: drawCards(5),
      opponentHand: drawCards(5),
      currentTurn: 'PLAYER',
      marketEvent: null,
      history: ['New Round Started. LFG!'],
      isGameOver: false,
      winner: null,
    });
    triggerNewMarketEvent();
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const toggleMusic = () => {
    if (isMusicOn) {
      synth.stop();
    } else {
      synth.start();
    }
    setIsMusicOn(!isMusicOn);
  };

  const handlePlayCard = (card: CryptoCard) => {
    if (gameState.currentTurn !== 'PLAYER' || gameState.isGameOver) return;

    let damage = card.power;
    if (gameState.marketEvent) {
      if (gameState.marketEvent.effect === 'BULLISH') {
        damage = Math.floor(damage * gameState.marketEvent.impactMultiplier * 1.5);
      } else if (gameState.marketEvent.effect === 'BEARISH') {
        damage = Math.floor(damage * 0.5);
      }
    }

    const avgStability = gameState.opponentHand.reduce((acc, c) => acc + c.stability, 0) / (gameState.opponentHand.length || 1);
    const finalDamage = Math.max(1, Math.floor(damage - (avgStability / 3)));

    const newOpponentHP = Math.max(0, gameState.opponentHP - finalDamage);
    const newHand = gameState.playerHand.filter(c => c.id !== card.id);
    const finalHand = newHand.length < 3 ? [...newHand, ...drawCards(1)] : newHand;

    setGameState(prev => ({
      ...prev,
      opponentHP: newOpponentHP,
      playerHand: finalHand,
      currentTurn: 'OPPONENT',
      history: [`You PUMPED ${card.symbol} for ${finalDamage} damage!`, ...prev.history.slice(0, 5)],
      isGameOver: newOpponentHP <= 0,
      winner: newOpponentHP <= 0 ? 'PLAYER' : null
    }));

    if (newOpponentHP > 0) {
      setTimeout(cpuTurn, 1000);
    }
  };

  const cpuTurn = async () => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;
      const card = prev.opponentHand[Math.floor(Math.random() * prev.opponentHand.length)];
      let damage = card.power;
      if (prev.marketEvent) {
         if (prev.marketEvent.effect === 'BEARISH') {
           damage = Math.floor(damage * prev.marketEvent.impactMultiplier * 1.5);
         }
      }
      const avgStability = prev.playerHand.reduce((acc, c) => acc + c.stability, 0) / (prev.playerHand.length || 1);
      const finalDamage = Math.max(1, Math.floor(damage - (avgStability / 3)));
      const newPlayerHP = Math.max(0, prev.playerHP - finalDamage);
      const newHand = prev.opponentHand.filter(c => c.id !== card.id);
      const finalHand = newHand.length < 3 ? [...newHand, ...drawCards(1)] : newHand;

      return {
        ...prev,
        playerHP: newPlayerHP,
        opponentHand: finalHand,
        currentTurn: 'PLAYER',
        history: [`Opponent DUMPED ${card.symbol} for ${finalDamage} damage!`, ...prev.history.slice(0, 5)],
        isGameOver: newPlayerHP <= 0,
        winner: newPlayerHP <= 0 ? 'OPPONENT' : null
      };
    });
    
    setGameState(prev => {
      if (!prev.isGameOver) triggerNewMarketEvent();
      return prev;
    });
  };

  if (!isFrameReady) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-emerald-500 mono font-bold">
        SYNCHRONIZING WITH BASE...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 relative game-container">
      <div className="fixed inset-0 pointer-events-none opacity-5 flex flex-wrap gap-4 items-center justify-center -rotate-12 scale-150">
        {Array.from({length: 12}).map((_, i) => (
           <div key={i} className="text-6xl sm:text-8xl font-black mono select-none">HODL REKT MOON</div>
        ))}
      </div>

      <header className="flex justify-between items-center z-10 bg-slate-900/50 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700/50">
        <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
          <span className="text-emerald-500"><ICONS.Zap /></span>
          <span className="hidden xs:inline">CRYPTO WHALE</span>
          <span className="text-slate-500 font-light text-xs sm:text-sm">WARS</span>
        </h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMusic}
            className={`p-2 rounded-full text-[10px] sm:text-sm transition-colors ${isMusicOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}
          >
            {isMusicOn ? '🔊' : '🔇'}
          </button>
          <div className="px-2 sm:px-3 py-1 bg-slate-800 rounded-full border border-slate-700 mono text-[9px] sm:text-xs">
            Base #7.3M
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-4 z-10">
        {/* Opponent Zone */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
             <div className="text-center">
                <div className="w-32 sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden stat-bar">
                  <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${gameState.opponentHP}%` }}></div>
                </div>
             </div>
             <div className="text-sm sm:text-xl font-black mono text-rose-500">{gameState.opponentHP}%</div>
          </div>
          <div className="flex gap-2 justify-center scale-75 sm:scale-100 origin-center">
            {gameState.opponentHand.slice(0, 4).map((card, idx) => (
              <Card key={`${card.id}-${idx}`} card={card} isHidden />
            ))}
          </div>
        </div>

        {/* Market Pulse */}
        <div className="max-w-2xl mx-auto w-full px-1 scale-90 sm:scale-100">
           <MarketPulse event={gameState.marketEvent} loading={isLoadingEvent} />
        </div>

        {/* Player Zone */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 justify-center flex-wrap max-w-full scale-90 sm:scale-100">
            {gameState.playerHand.map((card, idx) => (
              <Card 
                key={`${card.id}-${idx}`} 
                card={card} 
                onClick={handlePlayCard}
                disabled={gameState.currentTurn !== 'PLAYER' || gameState.isGameOver}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-1">
             <div className="text-sm sm:text-xl font-black mono text-emerald-500">{gameState.playerHP}%</div>
             <div className="text-center">
                <div className="w-32 sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden stat-bar">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${gameState.playerHP}%` }}></div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* History sidebar and Mobile Footer logs remain the same... */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 p-6 sm:p-8 rounded-2xl max-w-sm w-full text-center crypto-glow">
            <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${gameState.winner === 'PLAYER' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {gameState.winner === 'PLAYER' ? 'WAGMI!' : 'REKT!'}
            </h2>
            <button 
              onClick={initGame}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold uppercase tracking-widest"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="p-2 bg-slate-900/80 rounded-t-xl border-t border-slate-700 z-20">
         <p className="text-[10px] mono text-center text-slate-500 truncate">{gameState.history[0]}</p>
      </div>
    </div>
  );
};

export default App;
