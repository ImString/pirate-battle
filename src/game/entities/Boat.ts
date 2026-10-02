type MoveDirection = 'up' | 'left' | 'right';
type BoatType = 'player' | 'shooter' | 'chaser';

export class Boat {
	private x: number = 0;
	private y: number = 0;
	private health: number = 100;
	private type: BoatType;

	constructor(x: number, y: number, type: BoatType) {
		this.x = x;
		this.y = y;
		this.type = type;

		this.health = 100;
	}

	public move(direction: MoveDirection) {
		if (direction === 'up') {
			this.y -= 1;
		} else if (direction === 'left') {
			this.x -= 1;
		} else if (direction === 'right') {
			this.x += 1;
		}
	}

	public getType() {
		return this.type;
	}

	public getHealth() {
		return this.health;
	}

	public getPosition() {
		return { x: this.x, y: this.y };
	}
}
