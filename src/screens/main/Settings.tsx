import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

import type { ScreenPage } from '@/types/global';

interface SettingsScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = props => {
	return (
		<Screen className="bg-[url(/assets/ui_scene_background.png)] bg-cover bg-center bg-no-repeat">
			<div className="pointer-events-none absolute inset-0 bg-black/25" />

			<Modal className="mx-4 my-auto flex flex-col items-center justify-between">
				<h1 className="text-2xl font-bold text-amber-200">OPTIONS</h1>
				<div>
					<p>Game session time</p>
					<p>Enemy spawn time</p>
				</div>
				<Button onClick={() => props.navigate('menu')}>Main Menu</Button>
			</Modal>
		</Screen>
	);
};
