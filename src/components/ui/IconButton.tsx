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
		<button {...buttonProps} type={type} className={twMerge('pirate-icon-button', className)}>
			<img
				src={iconSrc}
				alt={iconAlt}
				aria-hidden={iconAlt ? undefined : true}
				className={twMerge('pirate-icon-button__icon', iconClassName)}
			/>
		</button>
	);
};
