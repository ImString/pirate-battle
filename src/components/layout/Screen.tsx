import { twMerge } from 'tailwind-merge';

interface ScreenProps {
	className?: string;
	footerClassName?: string;
	children: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = props => {
	return (
		<main
			className={twMerge(
				'bg-ocean-dark relative flex h-full w-full flex-col items-center justify-center overflow-hidden [--screen-gap:clamp(8px,2vh,24px)]',
				props.className
			)}>
			<div className="flex h-full w-full items-center justify-center pt-[max(var(--screen-gap),env(safe-area-inset-top))] pr-[max(var(--screen-gap),env(safe-area-inset-right))] pb-[max(var(--screen-gap),env(safe-area-inset-bottom))] pl-[max(var(--screen-gap),env(safe-area-inset-left))] [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:block">
				{props.children}
			</div>
			<footer
				className={twMerge(
					'compact-landscape:hidden absolute right-20 bottom-2 z-10 hidden items-center gap-3 rounded-xl p-4 lg:flex',
					props.footerClassName
				)}>
				<img src="/assets/logo_jungle_gaming.svg" alt="Pirate Battle Logo" className="w-40" />
			</footer>
		</main>
	);
};
