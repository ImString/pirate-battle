import { useCallback, useEffect, useRef, type PointerEvent } from 'react';

import type { AttackDirection, MoveDirection } from '@/types/game';

import { IconButton } from '../ui/IconButton';

interface ControlsProps {
	onDirectionStart: (direction: MoveDirection) => void;
	onDirectionEnd: (direction: MoveDirection) => void;
	onAttackStart: (direction: AttackDirection) => void;
	onAttackEnd: (direction: AttackDirection) => void;
	onControlsReset: () => void;
}

type PlayerControl = MoveDirection | AttackDirection;

const keyboardControls: Record<string, PlayerControl> = {
	KeyW: 'forward',
	KeyA: 'turn-left',
	KeyD: 'turn-right',
	Space: 'front',
	KeyQ: 'left',
	KeyE: 'right'
};

const isMoveDirection = (control: PlayerControl): control is MoveDirection =>
	control === 'forward' || control === 'turn-left' || control === 'turn-right';

export const Controls: React.FC<ControlsProps> = props => {
	const { onDirectionStart, onDirectionEnd, onAttackStart, onAttackEnd, onControlsReset } = props;
	const activeSources = useRef(new Map<PlayerControl, Set<string>>());

	const startControl = useCallback(
		(control: PlayerControl, source: string) => {
			const sources = activeSources.current.get(control) ?? new Set<string>();
			if (sources.has(source)) return;

			const wasActive = sources.size > 0;
			sources.add(source);
			activeSources.current.set(control, sources);

			if (!wasActive) {
				if (isMoveDirection(control)) onDirectionStart(control);
				else onAttackStart(control);
			}
		},
		[onDirectionStart, onAttackStart]
	);

	const endControl = useCallback(
		(control: PlayerControl, source: string) => {
			const sources = activeSources.current.get(control);
			if (!sources?.delete(source) || sources.size > 0) return;

			activeSources.current.delete(control);
			if (isMoveDirection(control)) onDirectionEnd(control);
			else onAttackEnd(control);
		},
		[onDirectionEnd, onAttackEnd]
	);

	useEffect(() => {
		const sourcesByControl = activeSources.current;
		const resetControls = () => {
			sourcesByControl.clear();
			onControlsReset();
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			const control = keyboardControls[event.code];

			if (!control) return;

			event.preventDefault();
			if (event.repeat) return;
			startControl(control, event.code);
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			const control = keyboardControls[event.code];

			if (!control) return;

			event.preventDefault();
			endControl(control, event.code);
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('blur', resetControls);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('blur', resetControls);
			resetControls();
		};
	}, [startControl, endControl, onControlsReset]);

	const buttonControlProps = (control: PlayerControl) => ({
		onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
			if (event.button !== 0) return;

			event.preventDefault();
			event.currentTarget.setPointerCapture(event.pointerId);
			startControl(control, `pointer:${event.pointerId}`);
		},
		onPointerUp: (event: PointerEvent<HTMLButtonElement>) => endControl(control, `pointer:${event.pointerId}`),
		onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => endControl(control, `pointer:${event.pointerId}`),
		onLostPointerCapture: (event: PointerEvent<HTMLButtonElement>) =>
			endControl(control, `pointer:${event.pointerId}`)
	});

	return (
		<div className="game-controls pointer-events-none flex w-full items-end justify-between">
			<div className="gap-[clamp(4px,1vw,8px)]' pointer-events-auto mx-[clamp(0px,2vw,36px)] mb-[clamp(0px,3vh,36px)] flex items-center">
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_turn_left.png"
					iconAlt="Turn Left"
					title="Turn Left (A)"
					aria-keyshortcuts="A"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('turn-left')}
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_forward.png"
					iconAlt="Move Forward"
					title="Move Forward (W)"
					aria-keyshortcuts="W"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] translate-y-[-45%] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('forward')}
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_turn_right.png"
					iconAlt="Turn Right"
					title="Turn Right (D)"
					aria-keyshortcuts="D"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('turn-right')}
				/>
			</div>

			<div className="gap-[clamp(4px,1vw,8px)]' pointer-events-auto mx-[clamp(0px,2vw,36px)] mb-[clamp(0px,3vh,36px)] flex items-center">
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_left.png"
					iconAlt="Fire Left"
					title="Fire Left (Q)"
					aria-keyshortcuts="Q"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('left')}
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_front.png"
					iconAlt="Fire Forward"
					title="Fire Forward (Space)"
					aria-keyshortcuts="Space"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] translate-y-[-45%] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('front')}
				/>
				<IconButton
					iconSrc="/assets/png/default/ui/controls/icon_fire_right.png"
					iconAlt="Fire Right"
					title="Fire Right (E)"
					aria-keyshortcuts="E"
					className="pirate-icon-button--control size-[clamp(48px,15vh,70px)] touch-none [-webkit-touch-callout:none]"
					{...buttonControlProps('right')}
				/>
			</div>
		</div>
	);
};
