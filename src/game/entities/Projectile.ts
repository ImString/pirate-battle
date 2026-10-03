import type { Position } from '@/types/game';

export class Projectile {
	private static nextId = 0;
	private static readonly SPEED = 460;
	private static readonly COLLISION_RADIUS = 6;
	private static readonly DAMAGE = 10;
	private static readonly LIFETIME = 3;

	private readonly id = Projectile.nextId++;
	private position: Position;
	private direction: Position;
	private age: number = 0;
	private active: boolean = true;

	constructor(position: Position, target: Position) {
		this.position = { ...position };

		const distance = Math.hypot(target.x - position.x, target.y - position.y);
		this.direction =
			distance > 0
				? { x: (target.x - position.x) / distance, y: (target.y - position.y) / distance }
				: { x: 0, y: 1 };
	}

	public update(
		deltaTime: number,
		canMoveTo: (position: Position) => boolean,
		onMove: (position: Position) => boolean
	) {
		if (!this.active) return;

		const travelTime = Math.min(deltaTime, Projectile.LIFETIME - this.age);
		const distance = Projectile.SPEED * travelTime;
		const steps = Math.max(1, Math.ceil(distance / 2));

		for (let step = 0; step < steps; step++) {
			const nextPosition = {
				x: this.position.x + (this.direction.x * distance) / steps,
				y: this.position.y + (this.direction.y * distance) / steps
			};

			if (!canMoveTo(nextPosition)) {
				this.active = false;
				break;
			}

			this.position = nextPosition;

			if (onMove(nextPosition)) {
				this.active = false;
				break;
			}
		}

		this.age += travelTime;
		if (this.age >= Projectile.LIFETIME) this.active = false;
	}

	public getId() {
		return this.id;
	}

	public getPosition() {
		return { ...this.position };
	}

	public getCollisionRadius() {
		return Projectile.COLLISION_RADIUS;
	}

	public getDamage() {
		return Projectile.DAMAGE;
	}

	public isActive() {
		return this.active;
	}
}
