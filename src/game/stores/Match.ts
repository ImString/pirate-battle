import { create } from 'zustand';
import type { Game } from '../entities/Game';
import type { Player } from '../entities/Player';

interface MatchState {
	game: Game | null;
	setGame: (game: Game | null) => void;
	updateGame: (game: Partial<Game>) => void;
	player: Player | null;
	setPlayer: (player: Player | null) => void;
	cancelMatch: () => void;
}

export const useMatchStore = create<MatchState>()(set => ({
	game: null,

	setGame: game => set({ game }),
	updateGame: game =>
		set(state => {
			if (!state.game) return {};

			Object.assign(state.game, game);

			return { game: state.game };
		}),

	player: null,
	setPlayer: player => set({ player }),

	cancelMatch: () => set({ game: null, player: null })
}));
