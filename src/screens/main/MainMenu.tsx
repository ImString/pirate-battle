import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

import type { ScreenPage } from '@/types/global';

interface MainMenuScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = props => {
	return (
		<Screen>
			<Modal className="mx-4 my-auto w-full max-w-xl">
				<div className="flex flex-col items-center gap-2">
					<img
						src="/assets/png/default/ui/menu/title_pirate_battle.png"
						alt="Pirate Battle Logo"
						className="menu-header"
					/>

					<p className="mb-6 text-xs font-bold tracking-widest text-amber-200/80 uppercase">
						Set Sail. Take Command.
					</p>
				</div>

				<div className="mb-6 flex flex-col gap-2">
					<Button>Play</Button>
					<Button>Options</Button>
				</div>

				<div className="flex flex-col items-center gap-2">
					<img
						src="/assets/png/default/ships/ship_2.png"
						alt="Ship"
						className="h-16 w-10 object-contain drop-shadow"
					/>
					<span className="text-xs font-semibold tracking-wide text-amber-100/70">
						Navigate the islands. Survive the battle.
					</span>
				</div>

				<div className="flex gap-x-8">
					<Button variant="secondary">Ranking</Button>
					<Button variant="secondary">Match History</Button>
				</div>
			</Modal>
		</Screen>
	);
};
