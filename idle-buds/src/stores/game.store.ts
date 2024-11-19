import { create } from 'zustand';
import { TickConfig } from '../types/tick.types';

interface GameState {
  tick: TickConfig;
  isRunning: boolean;
  lastProcessedTick: number;
  startGame: () => void;
  pauseGame: () => void;
  processTick: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  tick: {
    ticksPerSecond: 20,
    maxTicksPerSecond: 60,
    minTicksPerSecond: 1,
    isRunning: false,
    lastTickTime: Date.now(),
    accumulatedTime: 0
  },
  isRunning: false,
  lastProcessedTick: 0,
  startGame: () => set({ isRunning: true }),
  pauseGame: () => set({ isRunning: false }),
  processTick: () => {
    set((state) => ({
      lastProcessedTick: state.lastProcessedTick + 1
    }));
  }
}));
