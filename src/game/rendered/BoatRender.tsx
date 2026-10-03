import { Rectangle, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';

import type { Boat } from '../entities/Boat';
import { useTextureStore } from '../stores/Texture';

interface BoatRenderProps {
	boat: Boat;
}

export const BoatRender: React.FC<BoatRenderProps> = props => {
	const [healthFills, setHealthFills] = useState<Texture[] | null>(null);

	const textureStore = useTextureStore();

	useEffect(() => {
		let active = true;
		let fills: Texture[] = [];

		const loadSprite = () => {
			if (!active) return;

			fills = ['green', 'red'].map(color => {
				const texture = textureStore.textures.ui?.textures[`enemy_health_fill_${color}`];

				return new Texture({
					source: texture?.source,
					frame: new Rectangle((texture?.frame.x || 0) + 21, (texture?.frame.y || 0) + 9, 118, 21)
				});
			});

			setHealthFills(fills);
		};

		loadSprite();

		return () => {
			active = false;
			fills.forEach(texture => texture.destroy());
		};
	}, []);

	if (!textureStore.textures.ships || !props.boat.isAlive()) {
		return <></>;
	}

	const healthRatio = Math.max(0, Math.min(1, props.boat.getHealth() / props.boat.getMaxHealth()));
	const shipTexture =
		props.boat.getType() === 'player'
			? 'ship_2.png'
			: props.boat.getType() === 'shooter'
				? 'ship_4.png'
				: 'ship_3.png';

	return (
		<pixiContainer x={props.boat.getPosition().x} y={props.boat.getPosition().y}>
			<pixiSprite
				texture={textureStore.textures.ships.textures[shipTexture]}
				anchor={0.5}
				rotation={props.boat.getRotation()}
			/>
			{props.boat.getType() !== 'player' && textureStore.textures.ui && healthFills && (
				<pixiContainer y={-props.boat.getBoundaryHalfSize().y - 24}>
					<pixiSprite
						texture={textureStore.textures.ui.textures['enemy_health_frame']}
						x={-40}
						width={80}
						height={20}
					/>
					<pixiSprite
						texture={healthFills[healthRatio > 0.3 ? 0 : 1]}
						x={-29.5}
						y={4.5}
						width={59 * healthRatio}
						height={10.5}
					/>
				</pixiContainer>
			)}
		</pixiContainer>
	);
};
