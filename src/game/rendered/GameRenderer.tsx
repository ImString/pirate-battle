import { initDevtools } from '@pixi/devtools';
import { Application } from '@pixi/react';
import { ResizePlugin } from 'pixi.js';

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
			sharedTicker></Application>
	);
};
