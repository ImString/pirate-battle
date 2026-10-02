import { Screen } from '@/components/layout/Screen';

import type { ScreenPage } from '@/types/global';

interface HistoryScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = () => {
	return (
		<Screen>
			<h1>History Screen</h1>
		</Screen>
	);
};
