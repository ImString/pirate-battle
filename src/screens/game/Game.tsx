import { Controls } from '@/components/game/Controls';
import { GameHud } from '@/components/game/GameHud';
import { Screen } from '@/components/layout/Screen';
import { GameRenderer } from '@/game/rendered/GameRenderer';

import type { ScreenPage } from '@/types/global';

interface GameScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const GameScreen: React.FC<GameScreenProps> = props => {
	return (
		<Screen footerClassName="bottom-52">
			<GameRenderer />

			<div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6">
				<GameHud pauseGame={() => props.navigate('pause')} />
				<Controls />
			</div>
		</Screen>
	);
};
