import { Boat } from './Boat';

export class Shooter extends Boat {
	constructor(startX: number, startY: number) {
		super(startX, startY, 'shooter');
	}
}
