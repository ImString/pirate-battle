import { Controls } from '@/components/game/Controls';
import { GameHud } from '@/components/game/GameHud';
import { Screen } from '@/components/layout/Screen';
import { GameRenderer } from '@/game/rendered/GameRenderer';
import { useMatchStore } from '@/game/stores/Match';

import type { ScreenPage } from '@/types/global';
import { PauseScreen } from './Pause';

interface GameScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const GameScreen: React.FC<GameScreenProps> = props => {
	const matchStore = useMatchStore();

	return (
		<Screen footerClassName="bottom-52">
			<GameRenderer />

			<div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6">
				<GameHud pauseGame={() => matchStore.updateGame({ state: 'paused' })} />
				<Controls />
			</div>

			{matchStore.game?.state == 'paused' && <PauseScreen navigate={props.navigate} />}
		</Screen>
	);
};
