import { useApplication } from '@pixi/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface CanvasDimensions {
	width: number;
	height: number;
	canvasWidth: number;
	canvasHeight: number;
}

export function useCanvasResize(): CanvasDimensions {
	const { app, isInitialised } = useApplication();

	const [dimensions, setDimensions] = useState<CanvasDimensions>(() => ({
		width: isInitialised ? app.screen.width : window.innerWidth,
		height: isInitialised ? app.screen.height : window.innerHeight,
		canvasWidth: isInitialised ? app.canvas.width : window.innerWidth,
		canvasHeight: isInitialised ? app.canvas.height : window.innerHeight
	}));

	useEffect(() => {
		if (!isInitialised) return;

		const renderer = app.renderer;
		const handleResize = () => {
			setDimensions({
				width: app.screen.width,
				height: app.screen.height,
				canvasWidth: app.canvas.width,
				canvasHeight: app.canvas.height
			});
		};

		renderer.on('resize', handleResize);
		window.addEventListener('resize', handleResize);

		handleResize();

		return () => {
			renderer.off('resize', handleResize);
			window.removeEventListener('resize', handleResize);
		};
	}, [app, isInitialised]);

	return dimensions;
}

export function useStateRef<T>(initialValue: T) {
	const [state, _setState] = useState<T>(initialValue);
	const stateRef = useRef<T>(initialValue);

	const setState = useCallback((value: React.SetStateAction<T>) => {
		const newState = typeof value === 'function' ? (value as (prevState: T) => T)(stateRef.current) : value;

		stateRef.current = newState;
		_setState(newState);
	}, []);

	return [state, setState, stateRef] as [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>];
}
