import { IconButton } from '../ui/IconButton';
import { useEffect } from 'react';
import type { MoveDirection } from '@/types/game';

interface ControlsProps {
	onDirectionStart: (direction: MoveDirection) => void;
	onDirectionEnd: (direction: MoveDirection) => void;
	onDirectionsReset: () => void;
}

const keyboardDirections: Record<string, MoveDirection> = {
	w: 'forward',
	a: 'turn-left',
	d: 'turn-right'
};

export const Controls: React.FC<ControlsProps> = props => {
	const { onDirectionStart, onDirectionEnd, onDirectionsReset } = props;

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const direction = keyboardDirections[event.key.toLowerCase()];

			if (!direction || event.repeat) return;

			event.preventDefault();
			onDirectionStart(direction);
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			const direction = keyboardDirections[event.key.toLowerCase()];

			if (!direction) return;

			event.preventDefault();
			onDirectionEnd(direction);
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('blur', onDirectionsReset);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('blur', onDirectionsReset);
		};
	}, [onDirectionEnd, onDirectionStart, onDirectionsReset]);

	const buttonControlProps = (direction: MoveDirection) => ({
		onPointerDown: () => onDirectionStart(direction),
		onPointerUp: () => onDirectionEnd(direction),
		onPointerLeave: () => onDirectionEnd(direction),
		onPointerCancel: () => onDirectionEnd(direction)
	});

	return (
		<div className="pointer-events-none flex w-full items-end justify-between">
			<div className="pointer-events-auto mb-14 ml-9 flex items-center gap-2">
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_turn_left.png"
					iconAlt="Turn Left"
					className="pirate-icon-button--control h-17.5 w-17.5"
					{...buttonControlProps('turn-left')}
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_forward.png"
					iconAlt="Move Forward"
					className="pirate-icon-button--control h-17.5 w-17.5 -translate-y-10"
					{...buttonControlProps('forward')}
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_turn_right.png"
					iconAlt="Turn Right"
					className="pirate-icon-button--control h-17.5 w-17.5"
					{...buttonControlProps('turn-right')}
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
