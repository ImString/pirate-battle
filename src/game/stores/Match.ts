import { create } from 'zustand';

import type { MoveDirection } from '@/types/game';

import type { Boat } from '../entities/Boat';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';
import { getGameViewport } from '../rendered/viewport';
import { useStoreConfig } from './Config';

interface MatchState {
	startMatch: () => void;
	game: Game | null;
	setGame: (game: Game | null) => void;
	updateGame: (game: Partial<Game>) => void;
	player: Player | null;
	setPlayer: (player: Player | null) => void;
	setBoatDirection: (boat: Boat, direction: MoveDirection, isActive: boolean) => void;
	clearBoatDirections: (boat: Boat) => void;
	setMapSize: (width: number, height: number) => void;
	tickGame: (deltaTime: number) => void;
	cancelMatch: () => void;
}

export const useMatchStore = create<MatchState>()((set, get) => ({
	startMatch: () => {
		const game = new Game(useStoreConfig.getState().config);
		const viewport = getGameViewport(window.innerWidth, window.innerHeight);

		game.setMapSize(viewport.width, viewport.height);

		const player = new Player(viewport.width * 0.55, viewport.height * 0.6);
		game.addPlayer(player);

		set({ game, player });
	},

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

	setMapSize: (width, height) => {
		get().game?.setMapSize(width, height);
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
