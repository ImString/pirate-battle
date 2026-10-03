import type { BoatType, MoveDirection } from '@/types/game';

export class Boat {
	private static readonly MOVE_SPEED = 180;
	private static readonly TURN_SPEED = Math.PI * 1.5;

	private x: number = 0;
	private y: number = 0;
	private rotation: number = 0;
	private health: number = 100;
	private type: BoatType;

	constructor(x: number, y: number, type: BoatType) {
		this.x = x;
		this.y = y;
		this.type = type;

		this.health = 100;
	}

	public update(deltaTime: number, directions: ReadonlySet<MoveDirection>) {
		const turnDirection = Number(directions.has('turn-right')) - Number(directions.has('turn-left'));

		this.rotation += turnDirection * Boat.TURN_SPEED * deltaTime;

		if (directions.has('forward')) {
			const distance = Boat.MOVE_SPEED * deltaTime;

			this.x -= Math.sin(this.rotation) * distance;
			this.y += Math.cos(this.rotation) * distance;
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

	public getRotation() {
		return this.rotation;
	}
}
