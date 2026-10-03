export type MoveDirection = 'forward' | 'turn-left' | 'turn-right';
export type AttackDirection = 'front' | 'left' | 'right';
export type BoatType = 'player' | 'shooter' | 'chaser';

export type GameState = 'running' | 'paused' | 'finished';
export type FinishReason = 'time' | 'defeat';

export interface GameConfig {
	duration: number;
	enemySpawnInterval: number;
	enemySpawnDistance: number;
}

export interface Position {
	x: number;
	y: number;
}
