import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useMatchStore } from '@/game/stores/Match';

import type { ScreenPage } from '@/types/global';

interface PauseScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const PauseScreen: React.FC<PauseScreenProps> = props => {
	const matchStore = useMatchStore();

	return (
		<Screen
			className="absolute inset-0 z-20 flex items-center justify-center bg-black/50"
			footerClassName="hidden lg:hidden">
			<Modal className="flex flex-col items-center justify-center gap-3">
				<div className="flex flex-col items-center gap-3">
					<h1 className="text-shadow text-4xl font-extrabold text-amber-100">PAUSED</h1>
					<p className="font-semibold text-amber-100">Ready when you are.</p>
				</div>

				<div className="flex w-full flex-col items-center gap-2">
					<Button onClick={() => matchStore.updateGame({ state: 'running' })}>Resume</Button>
					<Button onClick={() => props.navigate('settings')}>Options</Button>
					<Button onClick={() => props.navigate('menu')}>Main Menu</Button>
				</div>
			</Modal>
		</Screen>
	);
};
