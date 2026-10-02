import { create } from 'zustand';
import type { Game } from '../entities/Game';
import type { Player } from '../entities/Player';

interface MatchState {
	game: Game | null;
	setGame: (game: Game | null) => void;
	player: Player | null;
	setPlayer: (player: Player | null) => void;
}

export const useMatchStore = create<MatchState>()(set => ({
	game: null,
	setGame: (game: Game | null) => set({ game }),
	player: null,
	setPlayer: (player: Player | null) => set({ player })
}));
