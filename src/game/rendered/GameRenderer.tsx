import { initDevtools } from '@pixi/devtools';
import { Application, extend } from '@pixi/react';
import { Container, ResizePlugin, Sprite, TilingSprite } from 'pixi.js';
import { GameEngine } from './GameEngine';

extend({
	Container,
	Sprite,
	TilingSprite
});

export const GameRenderer = () => {
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
