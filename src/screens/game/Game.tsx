import { Screen } from '@/components/layout/Screen';

import type { ScreenPage } from '@/types/global';

interface GameScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const GameScreen: React.FC<GameScreenProps> = props => {
	return (
		<Screen>
			<h1>Game Screen</h1>
		</Screen>
	);
};
