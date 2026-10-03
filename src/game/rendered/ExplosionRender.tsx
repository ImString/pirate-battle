import { Assets, type Spritesheet } from 'pixi.js';
import { useEffect, useState } from 'react';

import type { Explosion } from '../entities/Explosion';

interface ExplosionRenderProps {
	explosion: Explosion;
}

export const ExplosionRender: React.FC<ExplosionRenderProps> = props => {
	const [sprite, setSprite] = useState<Spritesheet | null>(null);

	useEffect(() => {
		const loadSprite = async () => {
			const sheet = await Assets.load<Spritesheet>('/assets/spritesheet/ships_miscellaneous_sheet.json');
			setSprite(sheet);
		};

		loadSprite();
	}, []);

	if (!sprite) return <></>;

	const progress = props.explosion.getProgress();
	const frame = Math.min(3, Math.floor(progress * 3) + 1);

	return (
		<pixiSprite
			texture={sprite.textures[`explosion_${frame}.png`]}
			x={props.explosion.getPosition().x}
			y={props.explosion.getPosition().y}
			anchor={0.5}
			scale={1.5}
			alpha={1 - progress * 0.5}
		/>
	);
};
