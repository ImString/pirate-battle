import { initDevtools } from '@pixi/devtools';
import { Application, extend } from '@pixi/react';
import { Container, ResizePlugin, Sprite, TilingSprite } from 'pixi.js';
import { useEffect } from 'react';

import { Modal } from '@/components/ui/Modal';

import { useMatchStore } from '../stores/Match';
import { useTextureStore } from '../stores/Texture';
import { GameEngine } from './GameEngine';

extend({
	Container,
	Sprite,
	TilingSprite
});

export const GameRenderer = () => {
	const isLoading = useTextureStore(state => state.isLoading);
	const loadTextures = useTextureStore(state => state.load);
	const destroyAllTextures = useTextureStore(state => state.destroyAllTextures);

	useEffect(() => {
		void loadTextures().catch(console.error);

		return () => {
			setTimeout(() => {
				const game = useMatchStore.getState().game;
				if (!game || game.state === 'finished') {
					void destroyAllTextures().catch(console.error);
				}
			}, 0);
		};
	}, [destroyAllTextures, loadTextures]);

	if (isLoading) {
		return (
			<div
				className="bg-ocean-dark absolute inset-0 z-40 flex items-center justify-center bg-[url(/assets/ui_scene_background.png)] bg-cover bg-center p-[max(12px,env(safe-area-inset-top),env(safe-area-inset-right),env(safe-area-inset-bottom),env(safe-area-inset-left))]"
				role="status"
				aria-live="polite"
				aria-busy="true">
				<div className="pointer-events-none absolute inset-0 bg-black/25" />
				<Modal className="compact-landscape:max-w-130 flex aspect-auto w-full max-w-130 flex-col items-center gap-[clamp(12px,3dvh,24px)] text-center">
					<img
						src="/assets/png/default/ui/menu/title_pirate_battle.png"
						alt="Pirate Battle"
						className="max-h-[20dvh] w-4/5 max-w-80 object-contain"
					/>
					<div
						className="relative grid size-[clamp(48px,12dvh,80px)] shrink-0 place-items-center"
						aria-hidden="true">
						<span className="border-t-pirate-gold absolute inset-0 rounded-full border-3 border-amber-200/20 motion-safe:animate-spin" />
						<img src="/assets/png/default/ships/ship_2.png" alt="" className="h-3/5 w-3/5 object-contain" />
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="text-shadow text-[clamp(18px,4dvh,28px)] font-extrabold tracking-widest text-amber-200">
							LOADING...
						</h1>
						<p className="text-[clamp(12px,2.4dvh,16px)] font-semibold text-amber-100/80">
							Preparing the ships for battle.
						</p>
					</div>
				</Modal>
			</div>
		);
	}

	return (
		<Application
			resizeTo={window}
			onInit={app => {
				initDevtools({ app });

				app.resizeTo = window;
			}}
			extensions={[ResizePlugin]}
			autoStart
			sharedTicker>
			<GameEngine />
		</Application>
	);
};
