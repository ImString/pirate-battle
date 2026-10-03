import { LOADING_SCREEN_IMAGES, UI_IMAGE_PATHS } from '@/assets/uiImages';
import { create } from 'zustand';

interface UiImagePreloadState {
	status: 'loading' | 'ready' | 'error';
	loaded: number;
	total: number;
	artworkReady: boolean;
	failedPaths: string[];
	preload: () => Promise<void>;
}

const loadedImages = new Map<string, HTMLImageElement>();
const imageTimeoutMs = 30_000;
const concurrentLoads = 6;

const preloadImage = (path: string): Promise<void> => {
	if (loadedImages.has(path)) return Promise.resolve();

	return new Promise((resolve, reject) => {
		const image = new Image();
		let settled = false;
		const finish = (error?: Error) => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timeout);
			image.onload = null;
			image.onerror = null;

			if (error) {
				image.removeAttribute('src');
				reject(error);
			} else {
				loadedImages.set(path, image);
				resolve();
			}
		};
		const timeout = window.setTimeout(() => finish(new Error(`Image loading timed out: ${path}`)), imageTimeoutMs);

		image.onload = () => {
			if (typeof image.decode === 'function') {
				void image.decode().then(
					() => finish(),
					() => finish(new Error(`Unable to decode image: ${path}`))
				);
			} else {
				finish();
			}
		};
		image.onerror = () => finish(new Error(`Unable to load image: ${path}`));
		image.src = path;
	});
};

export const useUiImagePreload = create<UiImagePreloadState>()((set, get) => {
	let pendingLoad: Promise<void> | undefined;

	const loadBatch = async (paths: readonly string[]) => {
		let nextIndex = 0;
		const worker = async () => {
			while (nextIndex < paths.length) {
				const path = paths[nextIndex++];
				try {
					await preloadImage(path);
					set({ loaded: loadedImages.size });
				} catch {
					set(state => ({ failedPaths: [...state.failedPaths, path] }));
				}
			}
		};

		await Promise.all(Array.from({ length: Math.min(concurrentLoads, paths.length) }, worker));
	};

	return {
		status: 'loading',
		loaded: 0,
		total: UI_IMAGE_PATHS.length,
		artworkReady: false,
		failedPaths: [],
		preload: () => {
			if (pendingLoad) return pendingLoad;
			if (get().status === 'ready') return Promise.resolve();

			const load = async () => {
				set({ status: 'loading', failedPaths: [] });
				await loadBatch(LOADING_SCREEN_IMAGES);
				set({ artworkReady: LOADING_SCREEN_IMAGES.every(path => loadedImages.has(path)) });
				await loadBatch(
					UI_IMAGE_PATHS.filter(path => !loadedImages.has(path) && !get().failedPaths.includes(path))
				);
				set({ status: get().failedPaths.length === 0 ? 'ready' : 'error' });
			};

			pendingLoad = load().finally(() => {
				pendingLoad = undefined;
			});
			return pendingLoad;
		}
	};
});
