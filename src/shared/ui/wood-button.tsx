import React from 'react';
import { twMerge } from 'tailwind-merge';

interface WoodButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary';
	children: React.ReactNode;
}

export const WoodButton: React.FC<WoodButtonProps> = props => {
	const isPrimary = props.variant === 'primary';

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (props.disabled) return;

		props.onClick?.(e);
	};

	return (
		<button
			{...props}
			type="button"
			onClick={handleClick}
			className={twMerge(
				`font-pirate relative inline-flex items-center justify-center bg-cover bg-no-repeat font-bold tracking-wider uppercase transition-transform focus:ring-4 focus:ring-yellow-400/60 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`,
				isPrimary
					? `bg-[url('/assets/png/default/ui/menu/button_primary_normal.png')] text-amber-950 hover:brightness-105 active:brightness-95`
					: `bg-[url('/assets/png/default/ui/menu/button_secondary_normal.png')] text-amber-100 hover:brightness-110 active:brightness-90`,
				props.className
			)}>
			<span className="relative z-10">{props.children}</span>
		</button>
	);
};
