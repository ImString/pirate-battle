import type { Position } from '@/types/game';

export interface MapTile {
	texture: string;
	x: number;
	y: number;
}

export interface MapIsland {
	anchor: 'top-left' | 'bottom-right';
	scale: number;
	tiles: MapTile[];
}

export const MAP_ISLANDS: MapIsland[] = [
	{
		anchor: 'top-left',
		scale: 1.6,
		tiles: [
			{
				texture: 'tile_56.png',
				x: 0,
				y: 0
			},
			{
				texture: 'tile_51.png',
				x: -30,
				y: 0
			},
			{
				texture: 'tile_56.png',
				x: 64,
				y: 0
			},
			{
				texture: 'tile_16.png',
				x: 84,
				y: 0
			},
			{
				texture: 'tile_61.png',
				x: 64,
				y: 0
			},
			{
				texture: 'tile_56.png',
				x: 128,
				y: 0
			},
			{
				texture: 'tile_48.png',
				x: 128,
				y: 0
			},
			{
				texture: 'tile_39.png',
				x: 192,
				y: 0
			},
			{
				texture: 'tile_16.png',
				x: 172,
				y: 0
			},
			{
				texture: 'tile_22.png',
				x: 128,
				y: 54
			},
			{
				texture: 'tile_23.png',
				x: 192,
				y: 54
			},
			{
				texture: 'tile_15.png',
				x: 192,
				y: 34
			},
			{
				texture: 'tile_45.png',
				x: 192,
				y: 0
			},
			{
				texture: 'tile_46.png',
				x: 192,
				y: 54
			},
			{
				texture: 'tile_40.png',
				x: 256,
				y: 0
			},
			{
				texture: 'tile_24.png',
				x: 256,
				y: 54
			},
			{
				texture: 'tile_76.png',
				x: 256,
				y: 54
			},
			{
				texture: 'tile_38.png',
				x: 128,
				y: 118
			},
			{
				texture: 'tile_71.png',
				x: 128,
				y: 118
			},
			{
				texture: 'tile_39.png',
				x: 192,
				y: 118
			},
			{
				texture: 'tile_40.png',
				x: 256,
				y: 118
			},
			{
				texture: 'tile_54.png',
				x: 128,
				y: 182
			},
			{
				texture: 'tile_55.png',
				x: 192,
				y: 182
			},
			{
				texture: 'tile_72.png',
				x: 193,
				y: 181
			},
			{
				texture: 'tile_56.png',
				x: 256,
				y: 182
			},
			{
				texture: 'tile_57.png',
				x: 320,
				y: 182
			},
			{
				texture: 'tile_39.png',
				x: 320,
				y: 0
			},
			{
				texture: 'tile_25.png',
				x: 320,
				y: 64
			},
			{
				texture: 'tile_41.png',
				x: 320,
				y: 118
			},
			{
				texture: 'tile_66.png',
				x: 320,
				y: 118
			},
			{
				texture: 'tile_15.png',
				x: 320,
				y: 32
			},
			{
				texture: 'tile_31.png',
				x: 320,
				y: 0
			},
			{
				texture: 'tile_62.png',
				x: 320,
				y: 54
			},
			{
				texture: 'tile_56.png',
				x: 381,
				y: 54
			},
			{
				texture: 'tile_40.png',
				x: 384,
				y: 0
			},
			{
				texture: 'tile_56.png',
				x: 384,
				y: 54
			},
			{
				texture: 'tile_71.png',
				x: 384,
				y: 0
			},
			{
				texture: 'tile_57.png',
				x: 448,
				y: 54
			},
			{
				texture: 'tile_41.png',
				x: 448,
				y: 0
			}
		]
	},
	{
		anchor: 'bottom-right',
		scale: 2,
		tiles: [
			{
				texture: 'tile_41.png',
				x: -64,
				y: -64
			},
			{
				texture: 'tile_40.png',
				x: -128,
				y: -64
			},
			{
				texture: 'tile_24.png',
				x: -128,
				y: -128
			},
			{
				texture: 'tile_41.png',
				x: -64,
				y: -128
			},
			{
				texture: 'tile_9.png',
				x: -64,
				y: -192
			},
			{
				texture: 'tile_8.png',
				x: -128,
				y: -192
			},
			{
				texture: 'tile_7.png',
				x: -192,
				y: -192
			},
			{
				texture: 'tile_6.png',
				x: -256,
				y: -192
			},
			{
				texture: 'tile_22.png',
				x: -256,
				y: -128
			},
			{
				texture: 'tile_53.png',
				x: -256,
				y: -64
			},
			{
				texture: 'tile_23.png',
				x: -192,
				y: -128
			},
			{
				texture: 'tile_88.png',
				x: -192,
				y: -128
			},
			{
				texture: 'tile_39.png',
				x: -192,
				y: -64
			},
			{
				texture: 'tile_71.png',
				x: -192,
				y: -64
			},
			{
				texture: 'tile_52.png',
				x: -384,
				y: -64
			},
			{
				texture: 'tile_7.png',
				x: -320,
				y: -64
			},
			{
				texture: 'tile_67.png',
				x: -320,
				y: -64
			},
			{
				texture: 'tile_9.png',
				x: -384,
				y: -128
			},
			{
				texture: 'tile_7.png',
				x: -448,
				y: -128
			},
			{
				texture: 'tile_7.png',
				x: -512,
				y: -128
			},
			{
				texture: 'tile_7.png',
				x: -576,
				y: -128
			},
			{
				texture: 'tile_6.png',
				x: -640,
				y: -128
			},
			{
				texture: 'tile_24.png',
				x: -448,
				y: -64
			},
			{
				texture: 'tile_23.png',
				x: -512,
				y: -64
			},
			{
				texture: 'tile_23.png',
				x: -576,
				y: -64
			},
			{
				texture: 'tile_22.png',
				x: -640,
				y: -64
			}
		]
	}
];

export const getIslandOrigin = (island: MapIsland, width: number, height: number): Position =>
	island.anchor === 'bottom-right' ? { x: width, y: height } : { x: 0, y: 0 };
