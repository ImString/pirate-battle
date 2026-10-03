import { useCallback } from 'react';

import { Controls } from '@/components/game/Controls';
import { GameHud } from '@/components/game/GameHud';
import { Screen } from '@/components/layout/Screen';

import { GameRenderer } from '@/game/rendered/GameRenderer';
import { useMatchStore } from '@/game/stores/Match';

import type { MoveDirection } from '@/types/game';
import type { ScreenPage } from '@/types/global';

import { GameoverScreen } from './Gameover';
import { PauseScreen } from './Pause';

interface GameScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const GameScreen: React.FC<GameScreenProps> = props => {
	const matchStore = useMatchStore();
	const isFinished = matchStore.game?.state === 'finished';
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
		<Screen footerClassName={isFinished ? 'hidden lg:hidden' : 'bottom-52'}>
			<GameRenderer key={matchStore.player?.getId()} />

			{!isFinished && (
				<div className="game-overlay pointer-events-none absolute inset-0 z-20 flex flex-col justify-between pt-[max(8px,env(safe-area-inset-top))] pr-[max(12px,env(safe-area-inset-right))] pb-[max(12px,env(safe-area-inset-bottom))] pl-[max(12px,env(safe-area-inset-left))]">
					<GameHud
						pauseGame={() => {
							resetPlayerDirections();
							matchStore.updateGame({ state: 'paused' });
						}}
					/>
					{matchStore.game?.state === 'running' && (
						<Controls
							onDirectionStart={startPlayerDirection}
							onDirectionEnd={endPlayerDirection}
							onDirectionsReset={resetPlayerDirections}
						/>
					)}
				</div>
			)}

			{matchStore.game?.state == 'paused' && <PauseScreen navigate={props.navigate} />}
			{isFinished && <GameoverScreen navigate={props.navigate} />}
		</Screen>
	);
};
