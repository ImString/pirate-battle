import { useCanvasResize } from '@/utils';
import { Assets, type Spritesheet } from 'pixi.js';
import { useEffect, useState } from 'react';

interface GameMapProps {
	children?: React.ReactNode;
}

export const GameMap: React.FC<GameMapProps> = props => {
	const [spirte, setSprite] = useState<Spritesheet | null>(null);
	const { width, height } = useCanvasResize();

	useEffect(() => {
		const loadSprite = async () => {
			const sprite = await Assets.load('/assets/tilesheet/spritesheet.json');
			setSprite(sprite);
		};

		loadSprite();
	}, []);

	if (!spirte) {
		return <></>;
	}

	return (
		<pixiContainer>
			<pixiTilingSprite
				scale={3.5}
				texture={spirte.textures['tile_73.png']}
				width={width}
				height={height}
				x={0}
				y={0}
			/>

			{/* FIRST ISLAND */}
			<pixiContainer x={0} y={0} scale={1.6}>
				<pixiSprite texture={spirte.textures['tile_56.png']} x={0} y={0} />
				<pixiSprite texture={spirte.textures['tile_51.png']} x={-30} y={0} />

				<pixiSprite texture={spirte.textures['tile_56.png']} x={64} y={0} />
				<pixiSprite texture={spirte.textures['tile_16.png']} x={84} y={0} />
				<pixiSprite texture={spirte.textures['tile_61.png']} x={64} y={0} />

				<pixiSprite texture={spirte.textures['tile_56.png']} x={128} y={0} />
				<pixiSprite texture={spirte.textures['tile_48.png']} x={128} y={0} />

				<pixiSprite texture={spirte.textures['tile_39.png']} x={192} y={0} />
				<pixiSprite texture={spirte.textures['tile_16.png']} x={172} y={0} />

				<pixiSprite texture={spirte.textures['tile_22.png']} x={128} y={54} />

				<pixiSprite texture={spirte.textures['tile_23.png']} x={192} y={54} />

				<pixiSprite texture={spirte.textures['tile_15.png']} x={192} y={34} />
				<pixiSprite texture={spirte.textures['tile_45.png']} x={192} y={0} />

				<pixiSprite texture={spirte.textures['tile_46.png']} x={192} y={54} />

				<pixiSprite texture={spirte.textures['tile_40.png']} x={256} y={0} />

				<pixiSprite texture={spirte.textures['tile_24.png']} x={256} y={54} />
				<pixiSprite texture={spirte.textures['tile_76.png']} x={256} y={54} />

				<pixiSprite texture={spirte.textures['tile_38.png']} x={128} y={118} />
				<pixiSprite texture={spirte.textures['tile_71.png']} x={128} y={118} />

				<pixiSprite texture={spirte.textures['tile_39.png']} x={192} y={118} />
				<pixiSprite texture={spirte.textures['tile_40.png']} x={256} y={118} />
				<pixiSprite texture={spirte.textures['tile_54.png']} x={128} y={182} />

				<pixiSprite texture={spirte.textures['tile_55.png']} x={192} y={182} />
				<pixiSprite texture={spirte.textures['tile_72.png']} x={193} y={181} />

				<pixiSprite texture={spirte.textures['tile_56.png']} x={256} y={182} />
				<pixiSprite texture={spirte.textures['tile_57.png']} x={320} y={182} />

				<pixiSprite texture={spirte.textures['tile_39.png']} x={320} y={0} />

				<pixiSprite texture={spirte.textures['tile_25.png']} x={320} y={64} />
				<pixiSprite texture={spirte.textures['tile_41.png']} x={320} y={118} />
				<pixiSprite texture={spirte.textures['tile_66.png']} x={320} y={118} />
				<pixiSprite texture={spirte.textures['tile_15.png']} x={320} y={32} />
				<pixiSprite texture={spirte.textures['tile_31.png']} x={320} y={0} />
				<pixiSprite texture={spirte.textures['tile_62.png']} x={320} y={54} />

				<pixiSprite texture={spirte.textures['tile_56.png']} x={381} y={54} />
				<pixiSprite texture={spirte.textures['tile_40.png']} x={384} y={0} />
				<pixiSprite texture={spirte.textures['tile_56.png']} x={384} y={54} />
				<pixiSprite texture={spirte.textures['tile_71.png']} x={384} y={0} />

				<pixiSprite texture={spirte.textures['tile_57.png']} x={448} y={54} />
				<pixiSprite texture={spirte.textures['tile_41.png']} x={448} y={0} />
			</pixiContainer>

			{/* SECOND ISLAND */}
			<pixiContainer x={width} y={height} scale={2.0}>
				<pixiSprite texture={spirte.textures['tile_41.png']} x={-64} y={-64} />
				<pixiSprite texture={spirte.textures['tile_40.png']} x={-128} y={-64} />
				<pixiSprite texture={spirte.textures['tile_24.png']} x={-128} y={-128} />
				<pixiSprite texture={spirte.textures['tile_41.png']} x={-64} y={-128} />
				<pixiSprite texture={spirte.textures['tile_9.png']} x={-64} y={-192} />
				<pixiSprite texture={spirte.textures['tile_8.png']} x={-128} y={-192} />
				<pixiSprite texture={spirte.textures['tile_7.png']} x={-192} y={-192} />
				<pixiSprite texture={spirte.textures['tile_6.png']} x={-256} y={-192} />
				<pixiSprite texture={spirte.textures['tile_22.png']} x={-256} y={-128} />
				<pixiSprite texture={spirte.textures['tile_53.png']} x={-256} y={-64} />

				<pixiSprite texture={spirte.textures['tile_23.png']} x={-192} y={-128} />
				<pixiSprite texture={spirte.textures['tile_88.png']} x={-192} y={-128} />
				<pixiSprite texture={spirte.textures['tile_39.png']} x={-192} y={-64} />
				<pixiSprite texture={spirte.textures['tile_71.png']} x={-192} y={-64} />

				<pixiSprite texture={spirte.textures['tile_52.png']} x={-384} y={-64} />
				<pixiSprite texture={spirte.textures['tile_7.png']} x={-320} y={-64} />
				<pixiSprite texture={spirte.textures['tile_67.png']} x={-320} y={-64} />

				<pixiSprite texture={spirte.textures['tile_9.png']} x={-384} y={-128} />

				<pixiSprite texture={spirte.textures['tile_7.png']} x={-448} y={-128} />
				<pixiSprite texture={spirte.textures['tile_7.png']} x={-512} y={-128} />
				<pixiSprite texture={spirte.textures['tile_7.png']} x={-576} y={-128} />
				<pixiSprite texture={spirte.textures['tile_6.png']} x={-640} y={-128} />

				<pixiSprite texture={spirte.textures['tile_24.png']} x={-448} y={-64} />
				<pixiSprite texture={spirte.textures['tile_23.png']} x={-512} y={-64} />
				<pixiSprite texture={spirte.textures['tile_23.png']} x={-576} y={-64} />
				<pixiSprite texture={spirte.textures['tile_22.png']} x={-640} y={-64} />
			</pixiContainer>

			{props.children}
		</pixiContainer>
	);
};
