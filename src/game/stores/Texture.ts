import { Assets, Spritesheet } from 'pixi.js';
import { create } from 'zustand';

interface TextureStoreList {
	map?: Spritesheet;
	ships?: Spritesheet;
	ui?: Spritesheet;
}

interface TextureStore {
	isLoading: boolean;
	textures: TextureStoreList;
	load: () => Promise<void>;
	destroyAllTextures: () => Promise<void>;
}

type TextureStoreKeys = keyof TextureStoreList;

export const useTextureStore = create<TextureStore>()((set, get) => {
	const texturePaths: Record<TextureStoreKeys, string> = {
		map: '/assets/tilesheet/spritesheet.json',
		ships: '/assets/spritesheet/ships_miscellaneous_sheet.json',
		ui: '/assets/spritesheet/ui_sheet.json'
	};
	let pendingOperation = Promise.resolve();

	const enqueue = (operation: () => Promise<void>) => {
		const result = pendingOperation.then(operation);
		pendingOperation = result.catch(() => {});
		return result;
	};

	return {
		isLoading: true,
		textures: {},
		load: () =>
			enqueue(async () => {
				if (Object.keys(texturePaths).every(name => get().textures[name as TextureStoreKeys])) return;
				set({ isLoading: true });

				for (const textureName of Object.keys(texturePaths) as TextureStoreKeys[]) {
					if (get().textures[textureName] === undefined) {
						const texture = await Assets.load(texturePaths[textureName]);
						if (texture)
							set(state => ({
								textures: {
									...state.textures,
									[textureName]: texture
								}
							}));
					}
				}

				set({ isLoading: false });
			}),
		destroyAllTextures: () =>
			enqueue(async () => {
				const loadedPaths = (Object.keys(get().textures) as TextureStoreKeys[]).map(name => texturePaths[name]);
				set({ textures: {}, isLoading: true });

				await Assets.unload(loadedPaths);
			})
	};
});
