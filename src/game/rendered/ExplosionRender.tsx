import type { Explosion } from '../entities/Explosion';
import { useTextureStore } from '../stores/Texture';

interface ExplosionRenderProps {
	explosion: Explosion;
}

export const ExplosionRender: React.FC<ExplosionRenderProps> = props => {
	const progress = props.explosion.getProgress();
	const frame = Math.min(3, Math.floor(progress * 3) + 1);

	const textureStore = useTextureStore();

	return (
		<pixiSprite
			texture={textureStore.textures.ships?.textures[`explosion_${frame}.png`]}
			x={props.explosion.getPosition().x}
			y={props.explosion.getPosition().y}
			anchor={0.5}
			scale={1.5}
			alpha={1 - progress * 0.5}
		/>
	);
};
