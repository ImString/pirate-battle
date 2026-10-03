import type { Projectile } from '../entities/Projectile';
import { useTextureStore } from '../stores/Texture';

interface ProjectileRenderProps {
	projectile: Projectile;
}

export const ProjectileRender: React.FC<ProjectileRenderProps> = props => {
	const textureStore = useTextureStore();
	return (
		<pixiSprite
			texture={textureStore.textures.ships?.textures['cannon_ball.png']}
			x={props.projectile.getPosition().x}
			y={props.projectile.getPosition().y}
			width={props.projectile.getCollisionRadius() * 2}
			height={props.projectile.getCollisionRadius() * 2}
			anchor={0.5}
		/>
	);
};
