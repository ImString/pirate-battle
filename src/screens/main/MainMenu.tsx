import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Game } from '@/game/entities/Game';
import { Player } from '@/game/entities/Player';
import { useMatchStore } from '@/game/stores/Match';
import { useEffect } from 'react';

import type { ScreenPage } from '@/types/global';

interface MainMenuScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = props => {
	const setGame = useMatchStore(state => state.setGame);
	const setPlayer = useMatchStore(state => state.setPlayer);

	const cancelMatch = useMatchStore(state => state.cancelMatch);

	useEffect(() => {
		cancelMatch();
	}, [cancelMatch]);

	const playGame = () => {
		const newGame = new Game();
		newGame.setMapSize(window.innerWidth, window.innerHeight);

		const player = new Player(window.innerWidth * 0.55, window.innerHeight * 0.6);
		newGame.addPlayer(player);

		setPlayer(player);
		setGame(newGame);

		props.navigate('game');
	};

	return (
		<Screen className="bg-[url(/assets/ui_scene_background.png)] bg-cover bg-center bg-no-repeat">
			<div className="pointer-events-none absolute inset-0 bg-black/25" />

			<Modal className="mx-4 my-auto">
				<div className="flex flex-col items-center gap-2">
					<img
						src="/assets/png/default/ui/menu/title_pirate_battle.png"
						alt="Pirate Battle Logo"
						className="menu-header"
					/>

					<p className="mb-6 text-xs font-black tracking-widest text-amber-200/80 uppercase">
						Set Sail. Take Command.
					</p>
				</div>

				<div className="mb-6 flex flex-col items-center gap-2">
					<Button variant="primary" onClick={() => playGame()}>
						Play
					</Button>
					<Button variant="primary" onClick={() => props.navigate('settings')}>
						Options
					</Button>
				</div>

				<div className="mb-7 flex flex-col items-center gap-4">
					<img
						src="/assets/png/default/ships/ship_2.png"
						alt="Ship"
						className="h-16 w-10 object-contain drop-shadow"
					/>
					<span className="text-xs font-bold tracking-wide text-amber-100/70">
						Navigate the islands. Survive the battle.
					</span>
				</div>

				<div className="flex justify-center gap-x-8">
					<Button variant="secondary" onClick={() => props.navigate('ranking')}>
						Ranking
					</Button>
					<Button variant="secondary" onClick={() => props.navigate('history')}>
						Match History
					</Button>
				</div>
			</Modal>
		</Screen>
	);
};
