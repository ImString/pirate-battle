import { useCanvasResize } from '@/utils';
import { Assets, type Spritesheet } from 'pixi.js';
import { useEffect, useState } from 'react';

import { MAP_ISLANDS, getIslandOrigin } from '../map/MapLayout';
import { getGameViewport } from './viewport';

interface GameMapProps {
	children?: React.ReactNode;
	onResize: (width: number, height: number) => void;
}

export const GameMap: React.FC<GameMapProps> = props => {
	const { children, onResize } = props;
	const [sprite, setSprite] = useState<Spritesheet | null>(null);
	const dimensions = useCanvasResize();
	const { width, height, scale } = getGameViewport(dimensions.width, dimensions.height);

	useEffect(() => {
		const loadSprite = async () => {
			const sheet = await Assets.load('/assets/tilesheet/spritesheet.json');
			setSprite(sheet);
		};

		loadSprite();
	}, []);

	useEffect(() => {
		onResize(width, height);
	}, [height, onResize, width]);

	if (!sprite) return <></>;

	return (
		<pixiContainer scale={scale}>
			<pixiTilingSprite
				scale={3.5}
				texture={sprite.textures['tile_73.png']}
				width={width}
				height={height}
				x={0}
				y={0}
			/>
			{MAP_ISLANDS.map((island, index) => {
				const origin = getIslandOrigin(island, width, height);

				return (
					<pixiContainer key={index} x={origin.x} y={origin.y} scale={island.scale}>
						{island.tiles.map((tile, tileIndex) => (
							<pixiSprite key={tileIndex} texture={sprite.textures[tile.texture]} x={tile.x} y={tile.y} />
						))}
					</pixiContainer>
				);
			})}
			{children}
		</pixiContainer>
	);
};
