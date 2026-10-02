import { Screen } from '@/components/layout/Screen';

import type { ScreenPage } from '@/types/global';

interface PauseScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const PauseScreen: React.FC<PauseScreenProps> = props => {
	return (
		<Screen>
			<h1>Pause Screen</h1>
		</Screen>
	);
};
