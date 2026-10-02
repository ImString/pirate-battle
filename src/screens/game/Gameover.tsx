import { Screen } from '@/components/layout/Screen';

import type { ScreenPage } from '@/types/global';

interface GameoverScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const GameoverScreen: React.FC<GameoverScreenProps> = () => {
	return (
		<Screen>
			<h1>Gameover Screen</h1>
		</Screen>
	);
};
