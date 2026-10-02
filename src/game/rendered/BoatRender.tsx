import { useEffect, useState } from 'react';
import type { Boat } from '../entities/Boat';
import { Assets, type Spritesheet } from 'pixi.js';

interface BoatRenderProps {
	boat: Boat;
}

export const BoatRender: React.FC<BoatRenderProps> = props => {
	const [spirte, setSprite] = useState<Spritesheet | null>(null);

	useEffect(() => {
		const loadSprite = async () => {
			const sprite = await Assets.load('/assets/spritesheet/ships_miscellaneous_sheet.json');
			setSprite(sprite);
		};

		loadSprite();
	}, []);

	if (!spirte) {
		return <></>;
	}

	return (
		<pixiContainer>
			<pixiSprite
				texture={spirte.textures[props.boat.getType() === 'player' ? 'ship_2.png' : 'ship_3.png']}
				x={props.boat.getPosition().x}
				y={props.boat.getPosition().y}
			/>
		</pixiContainer>
	);
};
