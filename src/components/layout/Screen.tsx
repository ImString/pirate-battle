interface ScreenProps {
	children: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = props => {
	return (
		<main className="bg-ocean-dark overflow-hiddenh-full relative flex h-full w-full flex-col items-center justify-center">
			<div className="flex items-center justify-center">{props.children}</div>
			<footer className="absolute right-6 bottom-6 z-20 flex items-center gap-3 rounded-xl p-4">
				<img src="/assets/logo_jungle_gaming.svg" alt="Pirate Battle Logo" className="w-40" />
			</footer>
		</main>
	);
};
