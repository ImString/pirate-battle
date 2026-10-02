import { twMerge } from 'tailwind-merge';
import { IconButton } from '../ui/IconButton';
import { ScoreItem } from './ScoreItem';

interface GameHudProps {
	pauseGame: () => void;
}

export const GameHud: React.FC<GameHudProps> = props => {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="pointer-events-auto flex items-center gap-2">
				<img src="/assets/png/default/ui/hud/icon_heart.png" className="h-8 w-8 object-contain" alt="Health" />

				<div
					className={twMerge(
						'relative h-8 w-44 md:w-52',
						'bg-[url(/assets/png/default/ui/hud/health_frame.png)] bg-size-[100%_100%] bg-no-repeat'
					)}>
					<div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: '76%' }}>
						<img
							src="/assets/png/default/ui/hud/health_fill_green.png"
							className="h-full w-44 max-w-none object-fill md:w-52"
							alt="Health Fill"
						/>
					</div>

					<span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
						76/100
					</span>
				</div>
			</div>
			<div className="pointer-events-auto flex items-center gap-3">
				<ScoreItem icon="/assets/png/default/ui/hud/icon_score.png" score={24} />
				<ScoreItem icon="/assets/png/default/ui/hud/icon_time.png" score={'01:42'} />

				<IconButton iconSrc="/assets/png/default/ui/controls/icon_pause.png" onClick={props.pauseGame} />
			</div>
		</div>
	);
};
