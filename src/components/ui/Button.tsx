import { twMerge } from 'tailwind-merge';

interface ButtonProps {
	variant?: 'primary' | 'secondary';
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

export const Button: React.FC<ButtonProps> = props => {
	const variant = props.variant ?? 'primary';

	return (
		<button
			className={twMerge(
				'pirate-button font-pirate relative inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-center bg-no-repeat uppercase transition-transform duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:cursor-not-allowed disabled:opacity-60',
				variant === 'primary'
					? 'pirate-button--primary compact-landscape:h-[clamp(48px,12vh,80px)] compact-landscape:text-[clamp(20px,4vh,28px)] h-24 w-full max-w-96 text-3xl font-black tracking-wide text-amber-950'
					: 'pirate-button--secondary compact-landscape:h-[clamp(44px,10vh,56px)] compact-landscape:text-[14px] h-14 w-56 text-base font-extrabold tracking-wide text-white',
				props.className
			)}
			onClick={props.onClick}>
			{props.children}
		</button>
	);
};
