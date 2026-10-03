import { useCallback, useRef } from 'react';
import { useMatchStore } from '../stores/Match';
import { BoatRender } from './BoatRender';
import { GameMap } from './GameMap';
import { useTick } from '@pixi/react';

export const GameEngine: React.FC = () => {
	const matchStore = useMatchStore();
	const setMapSize = useMatchStore(state => state.setMapSize);

	const lastUpdate = useRef<number | null>(null);
	const wasRunning = useRef(false);
	const updateMapSize = useCallback(
		(width: number, height: number) => {
			setMapSize(width, height);
		},
		[setMapSize]
	);

	useTick(ticker => {
		const now = performance.now();

		if (matchStore.game === null || matchStore.game.state !== 'running') {
			wasRunning.current = false;
			lastUpdate.current = now;
			return;
		}

		if (!wasRunning.current || lastUpdate.current === null) {
			wasRunning.current = true;
			lastUpdate.current = now;
			return;
		}

		matchStore.tickGame(Math.min(ticker.deltaMS / 1000, 0.1));

		if (now - lastUpdate.current >= 1000) {
			lastUpdate.current = now;

			if (matchStore.game.time > 0) {
				matchStore.updateGame({ time: matchStore.game.time - 1 });
			}
		}
	});

	return (
		<GameMap onResize={updateMapSize}>
			{matchStore.game?.players.map((player, index) => (
				<BoatRender key={index} boat={player} />
			))}

			{matchStore.game?.enemies.map((enemy, index) => (
				<BoatRender key={index} boat={enemy} />
			))}
		</GameMap>
	);
};
