import { create } from 'zustand';

import type { AttackDirection, MoveDirection } from '@/types/game';

import type { Boat } from '../entities/Boat';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';
import { getGameViewport } from '../rendered/viewport';
import { useStoreConfig } from './Config';
import { useHistoryStore } from './History';

interface MatchState {
	startMatch: () => void;
	game: Game | null;
	setGame: (game: Game | null) => void;
	pauseGame: () => void;
	resumeGame: () => void;
	player: Player | null;
	setPlayer: (player: Player | null) => void;
	setBoatDirection: (boat: Boat, direction: MoveDirection, isActive: boolean) => void;
	clearBoatDirections: (boat: Boat) => void;
	setPlayerAttack: (player: Player, direction: AttackDirection, isActive: boolean) => void;
	clearPlayerAttacks: (player: Player) => void;
	setMapSize: (width: number, height: number) => void;
	tickGame: (deltaTime: number) => void;
	cancelMatch: () => void;
}

export const useMatchStore = create<MatchState>()((set, get) => {
	let discardNextTick = true;

	return {
		startMatch: () => {
			const game = new Game(useStoreConfig.getState().config);
			const viewport = getGameViewport(window.innerWidth, window.innerHeight);

			game.setMapSize(viewport.width, viewport.height);

			const player = new Player(viewport.width * 0.55, viewport.height * 0.6);
			game.addPlayer(player);

			discardNextTick = true;
			set({ game, player });
		},

		game: null,

		setGame: game => {
			discardNextTick = true;
			set({ game });
		},
		pauseGame: () => {
			const game = get().game;
			if (!game || game.state !== 'running') return;

			game.pause();
			set({ game });
		},
		resumeGame: () => {
			const game = get().game;
			if (!game || game.state !== 'paused' || document.hidden || !document.hasFocus()) return;

			game.resume();

			discardNextTick = true;
			set({ game });
		},

		setBoatDirection: (boat, direction, isActive) => {
			get().game?.setBoatDirection(boat, direction, isActive);
		},

		clearBoatDirections: boat => {
			get().game?.clearBoatDirections(boat);
		},

		setPlayerAttack: (player, direction, isActive) => {
			get().game?.setPlayerAttack(player, direction, isActive);
		},

		clearPlayerAttacks: player => {
			get().game?.clearPlayerAttacks(player);
		},

		setMapSize: (width, height) => {
			get().game?.setMapSize(width, height);
		},

		tickGame: deltaTime => {
			const game = get().game;
			if (!game || game.state !== 'running') return;
			if (discardNextTick) {
				discardNextTick = false;
				return;
			}

			game.update(deltaTime);

			if (game.finishReason !== null) {
				useHistoryStore.getState().recordMatch({
					id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
					completedAt: new Date().toISOString(),
					points: game.score,
					duration: Math.floor(game.getElapsedTime() + 1e-8),
					result: game.finishReason === 'defeat' ? 'defeated' : 'time-up'
				});
			}

			set({ game });
		},

		player: null,
		setPlayer: player => set({ player }),

		cancelMatch: () => set({ game: null, player: null })
	};
});
