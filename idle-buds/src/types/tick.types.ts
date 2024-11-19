export interface TickConfig {
    ticksPerSecond: number;
    maxTicksPerSecond: number;
    minTicksPerSecond: number;
    isRunning: boolean;
    lastTickTime: number;
    accumulatedTime: number;
  }