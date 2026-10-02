import { useCanvasResize } from '@/utils';
import { Assets, type Spritesheet } from 'pixi.js';
import { useEffect, useState } from 'react';

interface GameMapProps {
	children?: React.ReactNode;
}

export const GameMap: React.FC<GameMapProps> = props => {
	const [sheet, setSheet] = useState<Spritesheet | null>(null);
	const { width, height } = useCanvasResize();

	useEffect(() => {
		Assets.load('/assets/tilesheet/spritesheet.json').then(setSheet);
	}, []);

	if (!sheet) {
		return <></>;
	}

	return (
		<pixiContainer>
			<pixiTilingSprite texture={sheet.textures['tile_73.png']} width={width} height={height} x={0} y={0} />

			{/* FIRST ISLAND */}
			<pixiSprite texture={sheet.textures['tile_56.png']} x={0} y={0} />
			<pixiSprite texture={sheet.textures['tile_51.png']} x={-30} y={0} />

			<pixiSprite texture={sheet.textures['tile_56.png']} x={64} y={0} />
			<pixiSprite texture={sheet.textures['tile_16.png']} x={84} y={0} />
			<pixiSprite texture={sheet.textures['tile_61.png']} x={64} y={0} />

			<pixiSprite texture={sheet.textures['tile_56.png']} x={128} y={0} />
			<pixiSprite texture={sheet.textures['tile_48.png']} x={128} y={0} />

			<pixiSprite texture={sheet.textures['tile_39.png']} x={192} y={0} />
			<pixiSprite texture={sheet.textures['tile_16.png']} x={172} y={0} />

			<pixiSprite texture={sheet.textures['tile_22.png']} x={128} y={54} />

			<pixiSprite texture={sheet.textures['tile_23.png']} x={192} y={54} />

			<pixiSprite texture={sheet.textures['tile_15.png']} x={192} y={34} />
			<pixiSprite texture={sheet.textures['tile_45.png']} x={192} y={0} />

			<pixiSprite texture={sheet.textures['tile_46.png']} x={192} y={54} />

			<pixiSprite texture={sheet.textures['tile_40.png']} x={256} y={0} />

			<pixiSprite texture={sheet.textures['tile_24.png']} x={256} y={54} />
			<pixiSprite texture={sheet.textures['tile_76.png']} x={256} y={54} />

			<pixiSprite texture={sheet.textures['tile_38.png']} x={128} y={118} />
			<pixiSprite texture={sheet.textures['tile_71.png']} x={128} y={118} />

			<pixiSprite texture={sheet.textures['tile_39.png']} x={192} y={118} />
			<pixiSprite texture={sheet.textures['tile_40.png']} x={256} y={118} />
			<pixiSprite texture={sheet.textures['tile_54.png']} x={128} y={182} />

			<pixiSprite texture={sheet.textures['tile_55.png']} x={192} y={182} />
			<pixiSprite texture={sheet.textures['tile_72.png']} x={192} y={182} />

			<pixiSprite texture={sheet.textures['tile_56.png']} x={256} y={182} />
			<pixiSprite texture={sheet.textures['tile_57.png']} x={320} y={182} />

			<pixiSprite texture={sheet.textures['tile_39.png']} x={320} y={0} />

			<pixiSprite texture={sheet.textures['tile_25.png']} x={320} y={64} />
			<pixiSprite texture={sheet.textures['tile_41.png']} x={320} y={118} />
			<pixiSprite texture={sheet.textures['tile_66.png']} x={320} y={118} />
			<pixiSprite texture={sheet.textures['tile_15.png']} x={320} y={32} />
			<pixiSprite texture={sheet.textures['tile_31.png']} x={320} y={0} />
			<pixiSprite texture={sheet.textures['tile_62.png']} x={320} y={54} />

			<pixiSprite texture={sheet.textures['tile_56.png']} x={381} y={54} />
			<pixiSprite texture={sheet.textures['tile_40.png']} x={384} y={0} />
			<pixiSprite texture={sheet.textures['tile_56.png']} x={384} y={54} />
			<pixiSprite texture={sheet.textures['tile_71.png']} x={384} y={0} />

			<pixiSprite texture={sheet.textures['tile_57.png']} x={448} y={54} />
			<pixiSprite texture={sheet.textures['tile_41.png']} x={448} y={0} />

			{/* SECOND ISLAND */}
			<pixiSprite texture={sheet.textures['tile_41.png']} x={width - 64} y={height - 64} />
			<pixiSprite texture={sheet.textures['tile_40.png']} x={width - 128} y={height - 64} />
			<pixiSprite texture={sheet.textures['tile_24.png']} x={width - 128} y={height - 128} />
			<pixiSprite texture={sheet.textures['tile_25.png']} x={width - 64} y={height - 128} />
			<pixiSprite texture={sheet.textures['tile_9.png']} x={width - 64} y={height - 192} />
			<pixiSprite texture={sheet.textures['tile_8.png']} x={width - 128} y={height - 192} />
			<pixiSprite texture={sheet.textures['tile_7.png']} x={width - 192} y={height - 192} />
			<pixiSprite texture={sheet.textures['tile_6.png']} x={width - 256} y={height - 192} />
			<pixiSprite texture={sheet.textures['tile_22.png']} x={width - 256} y={height - 128} />
			<pixiSprite texture={sheet.textures['tile_53.png']} x={width - 256} y={height - 64} />

			<pixiSprite texture={sheet.textures['tile_23.png']} x={width - 192} y={height - 128} />
			<pixiSprite texture={sheet.textures['tile_88.png']} x={width - 192} y={height - 128} />
			<pixiSprite texture={sheet.textures['tile_39.png']} x={width - 192} y={height - 64} />
			<pixiSprite texture={sheet.textures['tile_71.png']} x={width - 192} y={height - 64} />

			<pixiSprite texture={sheet.textures['tile_52.png']} x={width - 384} y={height - 64} />
			<pixiSprite texture={sheet.textures['tile_7.png']} x={width - 320} y={height - 64} />
			<pixiSprite texture={sheet.textures['tile_67.png']} x={width - 320} y={height - 64} />

			<pixiSprite texture={sheet.textures['tile_9.png']} x={width - 384} y={height - 128} />

			<pixiSprite texture={sheet.textures['tile_82.png']} x={width - 384} y={height - 64} angle={-180} />

			<pixiSprite texture={sheet.textures['tile_7.png']} x={width - 512} y={height - 128} />
			<pixiSprite texture={sheet.textures['tile_7.png']} x={width - 576} y={height - 128} />
			<pixiSprite texture={sheet.textures['tile_6.png']} x={width - 640} y={height - 128} />

			<pixiSprite texture={sheet.textures['tile_24.png']} x={width - 448} y={height - 64} />
			<pixiSprite texture={sheet.textures['tile_23.png']} x={width - 512} y={height - 64} />
			<pixiSprite texture={sheet.textures['tile_23.png']} x={width - 576} y={height - 64} />
			<pixiSprite texture={sheet.textures['tile_22.png']} x={width - 640} y={height - 64} />

			{props.children}
		</pixiContainer>
	);
};
