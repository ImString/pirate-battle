import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type IconButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
	iconSrc: string;
	iconAlt?: string;
	iconClassName?: string;
};

export const IconButton: React.FC<IconButtonProps> = props => {
	const { iconSrc, iconAlt = '', iconClassName, className, type = 'button', ...buttonProps } = props;

	return (
		<button
			{...buttonProps}
			type={type}
			className={twMerge(
				'pirate-icon-button inline-grid h-16 w-16 cursor-pointer place-items-center rounded-full border-0',
				className
			)}>
			<img
				src={iconSrc}
				alt={iconAlt}
				aria-hidden={iconAlt ? undefined : true}
				className={twMerge('pirate-icon-button__icon', iconClassName)}
			/>
		</button>
	);
};
