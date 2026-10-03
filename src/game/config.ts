import type { GameConfig } from '@/types/game';

export const GAME_CONFIG_LIMITS = {
	duration: { min: 30, max: 300, step: 15 },
	enemySpawnInterval: { min: 5, max: 120, step: 5 }
} as const;

export const DEFAULT_GAME_CONFIG: Readonly<GameConfig> = {
	duration: 120,
	enemySpawnInterval: 30,
	enemySpawnDistance: 360
};

export const resolveGameConfig = (config: Partial<GameConfig> = {}): GameConfig => {
	const secondsValue = (value: number | undefined, fallback: number, limits: { min: number; max: number }) =>
		typeof value === 'number' && Number.isInteger(value) && value >= limits.min && value <= limits.max
			? value
			: fallback;
	const positiveValue = (value: number | undefined, fallback: number) =>
		typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;

	return {
		duration: secondsValue(config.duration, DEFAULT_GAME_CONFIG.duration, GAME_CONFIG_LIMITS.duration),
		enemySpawnInterval: secondsValue(
			config.enemySpawnInterval,
			DEFAULT_GAME_CONFIG.enemySpawnInterval,
			GAME_CONFIG_LIMITS.enemySpawnInterval
		),
		enemySpawnDistance: positiveValue(config.enemySpawnDistance, DEFAULT_GAME_CONFIG.enemySpawnDistance)
	};
};
