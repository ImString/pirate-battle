import { Screen } from '@/components/layout/Screen';

import type { ScreenPage } from '@/types/global';

interface RankingScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const RankingScreen: React.FC<RankingScreenProps> = props => {
	return (
		<Screen>
			<h1>Ranking Screen</h1>
		</Screen>
	);
};
