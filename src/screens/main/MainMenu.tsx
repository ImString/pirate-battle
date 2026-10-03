import { useEffect } from 'react';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

import { useMatchStore } from '@/game/stores/Match';

import type { ScreenPage } from '@/types/global';

interface MainMenuScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = props => {
	const startMatch = useMatchStore(state => state.startMatch);

	const cancelMatch = useMatchStore(state => state.cancelMatch);

	useEffect(() => {
		cancelMatch();
	}, [cancelMatch]);

	const playGame = () => {
		startMatch();
		props.navigate('game');
	};

	return (
		<Screen className="bg-[url(/assets/ui_scene_background.png)] bg-cover bg-center bg-no-repeat">
			<div className="pointer-events-none absolute inset-0 bg-black/25" />

			<Modal className="main-menu compact-landscape:grid compact-landscape:grid-cols-2 compact-landscape:items-center compact-landscape:gap-x-6 compact-landscape:gap-y-[clamp(8px,2vh,20px)] mx-4 my-auto">
				<div className="compact-landscape:col-start-1 compact-landscape:row-start-1 flex flex-col items-center gap-2">
					<img
						src="/assets/png/default/ui/menu/title_pirate_battle.png"
						alt="Pirate Battle Logo"
						className="compact-landscape:max-h-[28vh] w-[min(100%,360px)] object-contain"
					/>

					<p className="compact-landscape:mb-0 compact-landscape:text-[10px] mb-6 text-xs font-black tracking-widest text-amber-200/80 uppercase">
						Set Sail. Take Command.
					</p>
				</div>

				<div className="compact-landscape:col-start-2 compact-landscape:row-span-2 compact-landscape:row-start-1 compact-landscape:mb-0 mb-6 flex flex-col items-center gap-2">
					<Button variant="primary" onClick={() => playGame()}>
						Play
					</Button>
					<Button variant="primary" onClick={() => props.navigate('settings')}>
						Options
					</Button>
				</div>

				<div className="compact-landscape:col-start-1 compact-landscape:row-start-2 compact-landscape:mb-0 compact-landscape:gap-1 compact-landscape:text-center mb-7 flex flex-col items-center gap-4">
					<img
						src="/assets/png/default/ships/ship_2.png"
						alt="Ship"
						className="compact-landscape:h-[clamp(24px,8vh,56px)] h-16 w-10 object-contain drop-shadow"
					/>
					<span className="text-xs font-bold tracking-wide text-amber-100/70">
						Navigate the islands. Survive the battle.
					</span>
				</div>

				<div className="compact-landscape:col-span-full compact-landscape:gap-4 flex justify-center gap-x-8">
					<Button className="min-w-0 flex-1" variant="secondary" onClick={() => props.navigate('ranking')}>
						Ranking
					</Button>
					<Button className="min-w-0 flex-1" variant="secondary" onClick={() => props.navigate('history')}>
						Match History
					</Button>
				</div>
			</Modal>
		</Screen>
	);
};
