import { useRef } from 'react';
import { useMatchStore } from '../stores/Match';
import { BoatRender } from './BoatRender';
import { GameMap } from './GameMap';
import { useTick } from '@pixi/react';

export const GameEngine: React.FC = () => {
	const matchStore = useMatchStore();

	const lastUpdate = useRef(performance.now());

	useTick(() => {
		if (matchStore.game === null || matchStore.game.isPaused) return;

		const now = performance.now();

		if (now - lastUpdate.current >= 1000) {
			matchStore.game.time--;
			lastUpdate.current += 1000;

			matchStore.setGame(matchStore.game);
		}
	});

	return (
		<GameMap>
			{matchStore.game?.players.map((player, index) => (
				<BoatRender key={index} boat={player} />
			))}

			{matchStore.game?.enemies.map((enemy, index) => (
				<BoatRender key={index} boat={enemy} />
			))}
		</GameMap>
	);
};
