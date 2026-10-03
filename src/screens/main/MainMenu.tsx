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

			<Modal className="compact-landscape:aspect-auto compact-landscape:grid compact-landscape:w-[min(900px,100%,calc((100dvh_-_2*var(--screen-gap))*1.9))] compact-landscape:grid-cols-2 compact-landscape:gap-x-6 compact-landscape:gap-y-[clamp(8px,2dvh,20px)] my-auto flex aspect-auto w-full max-w-[900px] flex-col items-center justify-evenly gap-4 border-x-20 border-y-24 p-3 text-center sm:border-x-30 sm:border-y-38 sm:p-5 lg:aspect-6/5 lg:w-[min(900px,100%,calc((100dvh_-_max(var(--screen-gap),env(safe-area-inset-top))_-_max(var(--screen-gap),env(safe-area-inset-bottom)))*1.2))]">
				<div className="compact-landscape:col-start-1 compact-landscape:row-start-1 flex w-full flex-col items-center gap-2 sm:gap-3">
					<img
						src="/assets/png/default/ui/menu/title_pirate_battle.png"
						alt="Pirate Battle Logo"
						className="compact-landscape:max-h-[28dvh] w-4/5 max-w-[480px] object-contain"
					/>

					<p className="compact-landscape:text-[10px] text-[10px] font-black tracking-[0.2em] text-amber-200/80 uppercase sm:text-xs">
						Set Sail. Take Command.
					</p>
				</div>

				<div className="compact-landscape:col-start-2 compact-landscape:row-span-2 compact-landscape:row-start-1 flex w-full flex-col items-center gap-2 sm:gap-3">
					<Button
						className="compact-landscape:h-auto compact-landscape:w-[min(100%,clamp(136px,56dvh,280px))] compact-landscape:text-[clamp(16px,5dvh,26px)] aspect-4/1 h-auto w-full max-w-80 text-[clamp(20px,3dvh,28px)] sm:w-3/5"
						variant="primary"
						onClick={playGame}>
						Play
					</Button>
					<Button
						className="compact-landscape:h-auto compact-landscape:w-[min(100%,clamp(136px,56dvh,280px))] compact-landscape:text-[clamp(16px,5dvh,26px)] aspect-4/1 h-auto w-full max-w-80 text-[clamp(20px,3dvh,28px)] sm:w-3/5"
						variant="primary"
						onClick={() => props.navigate('settings')}>
						Options
					</Button>
				</div>

				<div className="compact-landscape:col-start-1 compact-landscape:row-start-2 compact-landscape:gap-1 flex flex-col items-center gap-2 sm:gap-3">
					<img
						src="/assets/png/default/ships/ship_2.png"
						alt="Ship"
						className="compact-landscape:h-[clamp(24px,8dvh,56px)] h-[clamp(32px,6dvh,64px)] w-10 object-contain drop-shadow [@media(orientation:landscape)_and_(max-height:300px)]:hidden"
					/>
					<span className="text-xs font-bold tracking-wide text-amber-100/70">
						Navigate the islands. Survive the battle.
					</span>
				</div>

				<div className="compact-landscape:col-span-full grid w-full max-w-[480px] grid-cols-2 justify-items-center gap-2 justify-self-center sm:gap-6">
					<Button
						className="compact-landscape:h-auto compact-landscape:text-[clamp(11px,3.2dvh,14px)] aspect-4/1 h-auto min-h-11 w-full min-w-0 text-[clamp(10px,1.5vw,14px)] tracking-normal"
						variant="secondary"
						onClick={() => props.navigate('ranking')}>
						Ranking
					</Button>
					<Button
						className="compact-landscape:h-auto compact-landscape:text-[clamp(11px,3.2dvh,14px)] aspect-4/1 h-auto min-h-11 w-full min-w-0 text-[clamp(10px,1.5vw,14px)] tracking-normal"
						variant="secondary"
						onClick={() => props.navigate('history')}>
						Match History
					</Button>
				</div>
			</Modal>
		</Screen>
	);
};
