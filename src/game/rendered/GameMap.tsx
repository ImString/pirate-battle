import { useCanvasResize } from '@/utils';
import { useEffect } from 'react';

import { MAP_ISLANDS, getIslandOrigin } from '../map/MapLayout';
import { getGameViewport } from './viewport';
import { useTextureStore } from '../stores/Texture';

interface GameMapProps {
	children?: React.ReactNode;
	onResize: (width: number, height: number) => void;
}

export const GameMap: React.FC<GameMapProps> = props => {
	const { onResize } = props;

	const textureStore = useTextureStore();

	const dimensions = useCanvasResize();
	const { width, height, scale } = getGameViewport(dimensions.width, dimensions.height);

	useEffect(() => {
		onResize(width, height);
	}, [height, onResize, width]);

	return (
		<pixiContainer scale={scale}>
			<pixiTilingSprite
				scale={3.5}
				texture={textureStore.textures.map?.textures['tile_73.png']}
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
							<pixiSprite
								key={tileIndex}
								texture={textureStore.textures.map?.textures[tile.texture]}
								x={tile.x}
								y={tile.y}
							/>
						))}
					</pixiContainer>
				);
			})}
			{props.children}
		</pixiContainer>
	);
};
