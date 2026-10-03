import { useTick } from '@pixi/react';
import { useCallback } from 'react';

import { useMatchStore } from '../stores/Match';
import { BoatRender } from './BoatRender';
import { ExplosionRender } from './ExplosionRender';
import { GameMap } from './GameMap';
import { ProjectileRender } from './ProjectileRender';

export const GameEngine: React.FC = () => {
	const matchStore = useMatchStore();
	const setMapSize = useMatchStore(state => state.setMapSize);

	const updateMapSize = useCallback(
		(width: number, height: number) => {
			setMapSize(width, height);
		},
		[setMapSize]
	);

	useTick(ticker => {
		const match = useMatchStore.getState();
		if (match.game === null || match.game.state !== 'running') return;

		if (document.hidden || !document.hasFocus()) {
			match.pauseGame();
			return;
		}

		match.tickGame(Math.min(ticker.deltaMS / 1000, 0.1));
	});

	return (
		<GameMap onResize={updateMapSize}>
			{matchStore.game?.players.map(player => (
				<BoatRender key={player.getId()} boat={player} />
			))}

			{matchStore.game?.enemies.map(enemy => (
				<BoatRender key={enemy.getId()} boat={enemy} />
			))}

			{matchStore.game?.projectiles.map(projectile => (
				<ProjectileRender key={projectile.getId()} projectile={projectile} />
			))}

			{matchStore.game?.explosions.map(explosion => (
				<ExplosionRender key={explosion.getId()} explosion={explosion} />
			))}
		</GameMap>
	);
};
