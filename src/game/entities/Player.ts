import { Boat } from './Boat';

export class Player extends Boat {
	constructor(startX: number, startY: number) {
		super(startX, startY, 'player');
	}
}
