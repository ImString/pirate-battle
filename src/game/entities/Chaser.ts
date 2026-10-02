import { Boat } from './Boat';

export class Chaser extends Boat {
	constructor(startX: number, startY: number) {
		super(startX, startY, 'chaser');
	}
}
