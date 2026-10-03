import { useEffect, useState } from 'react';

import { useMatchStore } from '@/game/stores/Match';

const portraitQuery = '(orientation: portrait) and (pointer: coarse)';

interface OrientationGuardProps {
	children: React.ReactNode;
}

export const OrientationGuard: React.FC<OrientationGuardProps> = props => {
	const [portrait, setPortrait] = useState(() => window.matchMedia(portraitQuery).matches);
	const gameState = useMatchStore(state => state.game?.state);

	useEffect(() => {
		const query = window.matchMedia(portraitQuery);
		const onChange = () => setPortrait(query.matches);

		query.addEventListener('change', onChange);

		return () => query.removeEventListener('change', onChange);
	}, []);

	useEffect(() => {
		if (!portrait || gameState !== 'running') return;

		useMatchStore.getState().pauseGame();
	}, [portrait, gameState]);

	return (
		<>
			<div className="h-dvh w-full" inert={portrait}>
				{props.children}
			</div>
			{portrait && (
				<div
					className="bg-ocean-dark text-pirate-parchment fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 p-8 text-center"
					role="status"
					aria-live="polite">
					<span
						className="border-pirate-gold grid h-14 w-22 place-items-center rounded-xl border-3 text-4xl"
						aria-hidden="true">
						↻
					</span>
					<h1 className="text-pirate-gold text-[28px] font-extrabold">Gire seu aparelho</h1>
					<p className="max-w-80">Para jogar Pirate Battle, use o celular ou tablet na horizontal.</p>
				</div>
			)}
		</>
	);
};
