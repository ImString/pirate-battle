import { create } from 'zustand';
import type { MoveDirection } from '@/types/game';
import type { Boat } from '../entities/Boat';
import type { Game } from '../entities/Game';
import type { Player } from '../entities/Player';

interface MatchState {
	game: Game | null;
	setGame: (game: Game | null) => void;
	updateGame: (game: Partial<Game>) => void;
	player: Player | null;
	setPlayer: (player: Player | null) => void;
	setBoatDirection: (boat: Boat, direction: MoveDirection, isActive: boolean) => void;
	clearBoatDirections: (boat: Boat) => void;
	tickGame: (deltaTime: number) => void;
	cancelMatch: () => void;
}

export const useMatchStore = create<MatchState>()((set, get) => ({
	game: null,

	setGame: game => set({ game }),
	updateGame: game =>
		set(state => {
			if (!state.game) return {};

			Object.assign(state.game, game);

			return { game: state.game };
		}),

	setBoatDirection: (boat, direction, isActive) => {
		get().game?.setBoatDirection(boat, direction, isActive);
	},

	clearBoatDirections: boat => {
		get().game?.clearBoatDirections(boat);
	},

	tickGame: deltaTime =>
		set(state => {
			if (!state.game) return {};

			state.game.update(deltaTime);

			return { game: state.game };
		}),

	player: null,
	setPlayer: player => set({ player }),

	cancelMatch: () => set({ game: null, player: null })
}));
