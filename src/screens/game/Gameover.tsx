import { formatTime } from '@/utils/helper-common';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

import { useHistoryStore } from '@/game/stores/History';
import { useMatchStore } from '@/game/stores/Match';

import type { ScreenPage } from '@/types/global';

interface GameoverScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const GameoverScreen: React.FC<GameoverScreenProps> = props => {
	const matchStore = useMatchStore();
	const historySaveFailed = useHistoryStore(state => state.historySaveFailed);
	const isDefeat = matchStore.game?.finishReason === 'defeat';
	const elapsedTime = Math.floor((matchStore.game?.getElapsedTime() ?? 0) + 1e-8);

	return (
		<Screen className="absolute inset-0 z-30 flex items-center justify-center bg-black/25">
			<Modal className="result-panel flex items-center justify-center">
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="match-result-title"
					className="flex w-full flex-col items-center gap-[clamp(12px,2.4vh,24px)] text-center">
					<div className="flex w-full flex-col items-center gap-[clamp(12px,2.4vh,24px)]">
						<h1
							id="match-result-title"
							className="text-shadow text-[clamp(18px,4vh,40px)] leading-tight font-extrabold text-amber-100">
							{isDefeat ? 'BATTLE LOST' : 'BATTLE COMPLETE'}
						</h1>
						<div className="flex flex-col items-center gap-[clamp(8px,1.2vh,12px)]">
							<p className="text-[clamp(36px,8vh,80px)] leading-none font-extrabold text-amber-200">
								{matchStore.game?.score ?? 0}
							</p>
							<p className="text-[clamp(10px,1.6vh,16px)] font-bold text-amber-100/80">
								POINTS · {formatTime(elapsedTime)} · {isDefeat ? 'SHIP SUNK' : 'TIME UP'}
							</p>
						</div>
					</div>

					{historySaveFailed && (
						<p className="text-center text-xs text-amber-100">
							This result is available this session, but could not be saved in this browser.
						</p>
					)}

					<div className="flex w-[min(328px,max(180px,32.8vh),100%)] flex-col items-center gap-[clamp(8px,1.6vh,16px)]">
						<Button
							className="compact-landscape:h-[clamp(44px,8.4vh,84px)] compact-landscape:text-[clamp(16px,2.6vh,26px)] h-[clamp(44px,8.4vh,84px)] text-[clamp(16px,2.6vh,26px)]"
							onClick={() => matchStore.startMatch()}>
							Play Again
						</Button>
						<Button
							className="compact-landscape:h-[clamp(44px,8.4vh,84px)] compact-landscape:text-[clamp(16px,2.6vh,26px)] h-[clamp(44px,8.4vh,84px)] text-[clamp(16px,2.6vh,26px)]"
							onClick={() => {
								matchStore.cancelMatch();
								props.navigate('menu');
							}}>
							Main Menu
						</Button>
					</div>
				</div>
			</Modal>
		</Screen>
	);
};
