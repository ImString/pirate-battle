export type MoveDirection = 'forward' | 'turn-left' | 'turn-right';
export type BoatType = 'player' | 'shooter' | 'chaser';

export type GameState = 'running' | 'paused' | 'finished';

export interface Position {
	x: number;
	y: number;
}
