import type { GameConfig } from '@/types/game';

import { resolveGameConfig } from '../config';

export const CONFIG_STORAGE_KEY = 'pirate-battle:options';

export const loadGameConfig = (): GameConfig => {
	try {
		if (typeof window === 'undefined') return resolveGameConfig();

		const saved = window.localStorage.getItem(CONFIG_STORAGE_KEY);
		if (saved === null) return resolveGameConfig();

		const parsed: unknown = JSON.parse(saved);
		if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return resolveGameConfig();

		const options = parsed as Record<string, unknown>;
		return resolveGameConfig({
			duration: typeof options.duration === 'number' ? options.duration : undefined,
			enemySpawnInterval: typeof options.enemySpawnInterval === 'number' ? options.enemySpawnInterval : undefined
		});
	} catch {
		return resolveGameConfig();
	}
};

export const saveGameConfig = (config: GameConfig): boolean => {
	try {
		if (typeof window === 'undefined') return false;

		const { duration, enemySpawnInterval } = resolveGameConfig(config);
		window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ duration, enemySpawnInterval }));
		return true;
	} catch {
		return false;
	}
};
