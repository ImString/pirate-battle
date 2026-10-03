import { useEffect, type PointerEvent } from 'react';

import type { MoveDirection } from '@/types/game';

import { IconButton } from '../ui/IconButton';

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
			onDirectionsReset();
		};
	}, [onDirectionEnd, onDirectionStart, onDirectionsReset]);

	const buttonControlProps = (direction: MoveDirection) => ({
		onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.currentTarget.setPointerCapture(event.pointerId);
			onDirectionStart(direction);
		},
		onPointerUp: () => onDirectionEnd(direction),
		onPointerLeave: () => onDirectionEnd(direction),
		onPointerCancel: () => onDirectionEnd(direction),
		onLostPointerCapture: () => onDirectionEnd(direction)
	});

	return (
		<div className="game-controls pointer-events-none flex w-full items-end justify-between">
			<div className="gap-[clamp(4px,1vw,8px)]' pointer-events-auto mx-[clamp(0px,2vw,36px)] mb-[clamp(0px,3vh,36px)] flex items-center">
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_turn_left.png"
					iconAlt="Turn Left"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('turn-left')}
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_forward.png"
					iconAlt="Move Forward"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] translate-y-[-45%] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('forward')}
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_turn_right.png"
					iconAlt="Turn Right"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('turn-right')}
				/>
			</div>

			<div className="gap-[clamp(4px,1vw,8px)]' pointer-events-auto mx-[clamp(0px,2vw,36px)] mb-[clamp(0px,3vh,36px)] flex items-center">
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_left.png"
					iconAlt="Fire Left"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] touch-none [-webkit-touch-callout:none]"
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_front.png"
					iconAlt="Fire Forward"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] translate-y-[-45%] touch-none [-webkit-touch-callout:none]"
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_right.png"
					iconAlt="Fire Right"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] touch-none [-webkit-touch-callout:none]"
				/>
			</div>
		</div>
	);
};
