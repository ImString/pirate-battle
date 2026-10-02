import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface StepperProps {
	label?: string;
	value?: number;
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
	suffix?: string;
	disabled?: boolean;
	className?: string;
	onValueChange?: (value: number) => void;
}

export const Stepper: React.FC<StepperProps> = props => {
	const [internalValue, setInternalValue] = useState(props.defaultValue ?? 0);
	const isControlled = props.value !== undefined;
	const currentValue = props.value ?? internalValue;
	const canDecrease = !props.disabled && currentValue > (props.min ?? Number.NEGATIVE_INFINITY);
	const canIncrease = !props.disabled && currentValue < (props.max ?? Number.POSITIVE_INFINITY);

	const updateValue = (nextValue: number) => {
		const clampedValue = Math.min(
			props.max ?? Number.POSITIVE_INFINITY,
			Math.max(props.min ?? Number.NEGATIVE_INFINITY, nextValue)
		);

		if (!isControlled) {
			setInternalValue(clampedValue);
		}

		props.onValueChange?.(clampedValue);
	};

	return (
		<div className={twMerge('flex w-full max-w-md flex-col items-center gap-3', props.className)}>
			{props.label && <p className="text-center text-sm font-semibold text-amber-100">{props.label}</p>}

			<div className="flex w-full items-center justify-between">
				<button
					type="button"
					className="pirate-stepper-control"
					onClick={() => updateValue(currentValue - (props.step ?? 1))}
					disabled={!canDecrease}
					aria-label={props.label ? `Decrease ${props.label}` : 'Decrease value'}>
					<img src="/assets/png/default/ui/controls/icon_minus.png" alt="" aria-hidden="true" />
				</button>

				<p className="min-w-28 text-center text-2xl font-black text-amber-100 drop-shadow-md">
					{props.suffix ? `${currentValue} ${props.suffix}` : currentValue}
				</p>

				<button
					type="button"
					className="pirate-stepper-control"
					onClick={() => updateValue(currentValue + (props.step ?? 1))}
					disabled={!canIncrease}
					aria-label={props.label ? `Increase ${props.label}` : 'Increase value'}>
					<img src="/assets/png/default/ui/controls/icon_plus.png" alt="" aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};
