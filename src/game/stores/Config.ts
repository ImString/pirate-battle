import { create } from 'zustand';

import type { GameConfig } from '@/types/game';

import { resolveGameConfig } from '../config';
import { loadGameConfig, saveGameConfig } from './ConfigStorage';

interface ConfigState {
	config: GameConfig;
	configSaveFailed: boolean;
	setConfig: (config: Partial<GameConfig>) => void;
}

export const useStoreConfig = create<ConfigState>()((set, get) => ({
	config: loadGameConfig(),
	configSaveFailed: false,
	setConfig: config => {
		const nextConfig = resolveGameConfig({ ...get().config, ...config });
		const saved = saveGameConfig(nextConfig);
		set({ config: nextConfig, configSaveFailed: !saved });
	}
}));
