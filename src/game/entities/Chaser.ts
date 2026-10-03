import { Enemy } from './Enemy';

export class Chaser extends Enemy {
	private static readonly CHASE_SPEED = 140;
	private static readonly COLLISION_DAMAGE = 25;

	constructor(startX: number, startY: number) {
		super(startX, startY, 'chaser', Chaser.CHASE_SPEED);
	}

	public getCollisionDamage(): number {
		return Chaser.COLLISION_DAMAGE;
	}
}
