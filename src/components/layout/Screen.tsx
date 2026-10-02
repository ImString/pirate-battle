import { twMerge } from 'tailwind-merge';

interface ScreenProps {
	className?: string;
	children: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = props => {
	return (
		<main
			className={twMerge(
				'bg-ocean-dark overflow-hiddenh-full relative flex h-full w-full flex-col items-center justify-center',
				props.className
			)}>
			<div className="flex items-center justify-center">{props.children}</div>
			<footer className="absolute right-20 bottom-2 z-20 flex items-center gap-3 rounded-xl p-4">
				<img src="/assets/logo_jungle_gaming.svg" alt="Pirate Battle Logo" className="w-40" />
			</footer>
		</main>
	);
};
