import { Assets, Rectangle, Texture, type Spritesheet } from 'pixi.js';
import { useEffect, useState } from 'react';

import type { Boat } from '../entities/Boat';

interface BoatRenderProps {
	boat: Boat;
}

export const BoatRender: React.FC<BoatRenderProps> = props => {
	const [sprite, setSprite] = useState<Spritesheet | null>(null);
	const [hudSprite, setHudSprite] = useState<Spritesheet | null>(null);
	const [healthFills, setHealthFills] = useState<Texture[] | null>(null);

	useEffect(() => {
		let active = true;
		let fills: Texture[] = [];

		const loadSprite = async () => {
			const [ships, hud] = await Promise.all([
				Assets.load<Spritesheet>('/assets/spritesheet/ships_miscellaneous_sheet.json'),
				Assets.load<Spritesheet>('/assets/spritesheet/ui_sheet.json')
			]);

			if (!active) return;

			fills = ['green', 'red'].map(color => {
				const texture = hud.textures[`enemy_health_fill_${color}`];

				return new Texture({
					source: texture.source,
					frame: new Rectangle(texture.frame.x + 21, texture.frame.y + 9, 118, 21)
				});
			});

			setSprite(ships);
			setHudSprite(hud);
			setHealthFills(fills);
		};

		loadSprite();

		return () => {
			active = false;
			fills.forEach(texture => texture.destroy());
		};
	}, []);

	if (!sprite || !props.boat.isAlive()) {
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
			<pixiSprite texture={sprite.textures[shipTexture]} anchor={0.5} rotation={props.boat.getRotation()} />
			{props.boat.getType() !== 'player' && hudSprite && healthFills && (
				<pixiContainer y={-props.boat.getBoundaryHalfSize().y - 24}>
					<pixiSprite texture={hudSprite.textures['enemy_health_frame']} x={-40} width={80} height={20} />
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
