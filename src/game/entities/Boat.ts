import type { BoatType, MoveDirection, Position } from '@/types/game';

export class Boat {
	private static readonly MOVE_SPEED = 180;
	private static readonly TURN_SPEED = Math.PI * 1.5;
	private static readonly COLLISION_RADIUS = 28;

	private static readonly HALF_WIDTH = 33;
	private static readonly HALF_HEIGHT = 56.5;

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

	public update(
		deltaTime: number,
		directions: ReadonlySet<MoveDirection>,
		canMoveTo: (position: Position, rotation: number) => boolean = () => true,
		resolveTurnPosition: (position: Position, rotation: number) => Position = position => position
	) {
		const turnDirection = Number(directions.has('turn-right')) - Number(directions.has('turn-left'));

		const nextRotation = this.rotation + turnDirection * Boat.TURN_SPEED * deltaTime;

		if (turnDirection !== 0) {
			const turnPosition = resolveTurnPosition(this.getPosition(), nextRotation);

			if (canMoveTo(turnPosition, nextRotation)) {
				this.setPosition(turnPosition);
				this.rotation = nextRotation;
			}
		}

		if (directions.has('forward')) {
			const distance = Boat.MOVE_SPEED * deltaTime;
			const steps = Math.max(1, Math.ceil(distance / 2));
			const stepDistance = distance / steps;

			for (let step = 0; step < steps; step++) {
				const nextPosition = {
					x: this.x - Math.sin(this.rotation) * stepDistance,
					y: this.y + Math.cos(this.rotation) * stepDistance
				};

				if (!canMoveTo(nextPosition, this.rotation)) break;

				this.x = nextPosition.x;
				this.y = nextPosition.y;
			}
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

	public setPosition(position: Position) {
		this.x = position.x;
		this.y = position.y;
	}

	public getCollisionRadius() {
		return Boat.COLLISION_RADIUS;
	}

	public getBoundaryHalfSize(rotation: number = this.rotation): Position {
		const cosine = Math.abs(Math.cos(rotation));
		const sine = Math.abs(Math.sin(rotation));

		return {
			x: Boat.HALF_WIDTH * cosine + Boat.HALF_HEIGHT * sine,
			y: Boat.HALF_WIDTH * sine + Boat.HALF_HEIGHT * cosine
		};
	}

	public getRotation() {
		return this.rotation;
	}
}
