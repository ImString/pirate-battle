import { MainCard } from '@/features/main';

export const MainMenuPage: React.FC<{}> = () => {
	return (
		<main
			className="bg-ocean-dark fixed inset-0 flex overflow-hidden bg-[url(/assets/ui_scene_background.png)] bg-cover bg-center select-none"
			aria-label="Pirate Battle Main Menu">
			<div className="pointer-events-none absolute inset-0 bg-black/25" />

			<MainCard />
		</main>
	);
};
