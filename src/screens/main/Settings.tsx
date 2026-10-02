import { Screen } from '@/components/layout/Screen';

import type { ScreenPage } from '@/types/global';

interface SettingsScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
	return (
		<Screen>
			<h1>Settings Screen</h1>
		</Screen>
	);
};
