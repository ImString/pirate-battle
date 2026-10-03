import { initDevtools } from '@pixi/devtools';
import { Application, extend } from '@pixi/react';
import { Container, ResizePlugin, Sprite, TilingSprite } from 'pixi.js';
import { useEffect } from 'react';

import { LoadingScreen } from '@/components/layout/LoadingScreen';

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
		return <LoadingScreen description="Preparing the ships for battle." />;
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
