import { Controls } from '@/components/game/Controls';
import { GameHud } from '@/components/game/GameHud';
import { Screen } from '@/components/layout/Screen';
import { GameRenderer } from '@/game/rendered/GameRenderer';
import { useMatchStore } from '@/game/stores/Match';
import { useCallback } from 'react';

import type { MoveDirection } from '@/types/game';
import type { ScreenPage } from '@/types/global';
import { PauseScreen } from './Pause';

interface GameScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const GameScreen: React.FC<GameScreenProps> = props => {
	const matchStore = useMatchStore();
	const setBoatDirection = useMatchStore(state => state.setBoatDirection);
	const clearBoatDirections = useMatchStore(state => state.clearBoatDirections);
	const startPlayerDirection = useCallback(
		(direction: MoveDirection) => {
			if (matchStore.player) {
				setBoatDirection(matchStore.player, direction, true);
			}
		},
		[matchStore.player, setBoatDirection]
	);
	const endPlayerDirection = useCallback(
		(direction: MoveDirection) => {
			if (matchStore.player) {
				setBoatDirection(matchStore.player, direction, false);
			}
		},
		[matchStore.player, setBoatDirection]
	);
	const resetPlayerDirections = useCallback(() => {
		if (matchStore.player) {
			clearBoatDirections(matchStore.player);
		}
	}, [clearBoatDirections, matchStore.player]);

	return (
		<Screen footerClassName="bottom-52">
			<GameRenderer />

			<div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6">
				<GameHud
					pauseGame={() => {
						resetPlayerDirections();
						matchStore.updateGame({ state: 'paused' });
					}}
				/>
				<Controls
					onDirectionStart={startPlayerDirection}
					onDirectionEnd={endPlayerDirection}
					onDirectionsReset={resetPlayerDirections}
				/>
			</div>

			{matchStore.game?.state == 'paused' && <PauseScreen navigate={props.navigate} />}
		</Screen>
	);
};
