import { IconButton } from '../ui/IconButton';

export const Controls: React.FC = () => {
	return (
		<div className="pointer-events-none flex w-full items-end justify-between">
			<div className="pointer-events-auto mb-14 ml-9 flex items-center gap-2">
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_turn_left.png"
					iconAlt="Turn Left"
					className="pirate-icon-button--control h-17.5 w-17.5"
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_forward.png"
					iconAlt="Move Forward"
					className="pirate-icon-button--control h-17.5 w-17.5 -translate-y-10"
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_turn_right.png"
					iconAlt="Turn Right"
					className="pirate-icon-button--control h-17.5 w-17.5"
				/>
			</div>

			<div className="pointer-events-auto mr-9 mb-14 flex items-center gap-2">
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_left.png"
					iconAlt="Fire Left"
					className="pirate-icon-button--control h-17.5 w-17.5"
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_front.png"
					iconAlt="Fire Forward"
					className="pirate-icon-button--control h-17.5 w-17.5 -translate-y-10"
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_right.png"
					iconAlt="Fire Right"
					className="pirate-icon-button--control h-17.5 w-17.5"
				/>
			</div>
		</div>
	);
};
