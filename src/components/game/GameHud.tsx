import { formatTime } from '@/utils';
import { twMerge } from 'tailwind-merge';

import { useMatchStore } from '@/game/stores/Match';

import { IconButton } from '../ui/IconButton';
import { ScoreItem } from './ScoreItem';

interface GameHudProps {
	pauseGame: () => void;
}

export const GameHud: React.FC<GameHudProps> = props => {
	const matchStore = useMatchStore();

	return (
		<div className="flex w-full items-center justify-between gap-3 [--health-width:clamp(100px,20vw,208px)]">
			<div className="health-hud compact-hud:gap-1 pointer-events-auto flex items-center gap-2">
				<img
					src="/assets/png/default/ui/hud/icon_heart.png"
					className="compact-hud:size-6 size-8 object-contain"
					alt="Health"
				/>

				<div
					className={twMerge(
						'compact-hud:h-6 relative h-8 w-(--health-width)',
						'bg-[url(/assets/png/default/ui/hud/health_frame.png)] bg-size-[100%_100%] bg-no-repeat'
					)}>
					<div
						className="absolute inset-y-0 left-0 overflow-hidden"
						style={{ width: `${matchStore.player?.getHealth()}%` }}>
						<img
							src="/assets/png/default/ui/hud/health_fill_green.png"
							className="h-full w-(--health-width) max-w-none object-fill"
							alt="Health Fill"
						/>
					</div>

					<span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
						{`${matchStore.player?.getHealth()}/100`}
					</span>
				</div>
			</div>
			<div className="pointer-events-auto flex items-center gap-[clamp(4px,1vw,12px)]">
				<ScoreItem icon="/assets/png/default/ui/hud/icon_score.png" score={matchStore.game?.score || 0} />
				<ScoreItem
					icon="/assets/png/default/ui/hud/icon_time.png"
					score={formatTime(matchStore.game?.time || 0)}
				/>

				<IconButton
					className="size-[clamp(44px,11vh,64px)]"
					iconSrc="/assets/png/default/ui/controls/icon_pause.png"
					aria-label="Pause"
					onClick={props.pauseGame}
				/>
			</div>
		</div>
	);
};
