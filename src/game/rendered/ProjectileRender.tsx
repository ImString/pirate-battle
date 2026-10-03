import { Assets, type Spritesheet } from 'pixi.js';
import { useEffect, useState } from 'react';

import type { Projectile } from '../entities/Projectile';

interface ProjectileRenderProps {
	projectile: Projectile;
}

export const ProjectileRender: React.FC<ProjectileRenderProps> = props => {
	const [sprite, setSprite] = useState<Spritesheet | null>(null);

	useEffect(() => {
		const loadSprite = async () => {
			const sheet = await Assets.load<Spritesheet>('/assets/spritesheet/ships_miscellaneous_sheet.json');
			setSprite(sheet);
		};

		loadSprite();
	}, []);

	if (!sprite) return <></>;

	return (
		<pixiSprite
			texture={sprite.textures['cannon_ball.png']}
			x={props.projectile.getPosition().x}
			y={props.projectile.getPosition().y}
			width={props.projectile.getCollisionRadius() * 2}
			height={props.projectile.getCollisionRadius() * 2}
			anchor={0.5}
		/>
	);
};
