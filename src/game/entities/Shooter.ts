import type { Position } from '@/types/game';

import { Enemy } from './Enemy';

export class Shooter extends Enemy {
	private static readonly APPROACH_SPEED = 110;
	private static readonly ATTACK_RANGE = 300;
	private static readonly SHOT_INTERVAL = 2;
	private static readonly AIM_TOLERANCE = Math.PI / 18;

	private shotCooldown: number = Shooter.SHOT_INTERVAL;

	constructor(startX: number, startY: number) {
		super(startX, startY, 'shooter', Shooter.APPROACH_SPEED);
	}

	public getAttackRange(): number {
		return Shooter.ATTACK_RANGE;
	}

	public tryShoot(target: Position, deltaTime: number, hasLineOfSight: boolean): boolean {
		if (!this.isAlive() || !Number.isFinite(deltaTime) || deltaTime <= 0) return false;

		this.shotCooldown = Math.max(0, this.shotCooldown - deltaTime);

		const position = this.getPosition();
		const distance = Math.hypot(target.x - position.x, target.y - position.y);
		const isAiming = Math.abs(this.getAngleDifference(this.getAngleTo(target))) <= Shooter.AIM_TOLERANCE;

		if (this.shotCooldown > 0 || distance > Shooter.ATTACK_RANGE || !hasLineOfSight || !isAiming) return false;

		this.shotCooldown = Shooter.SHOT_INTERVAL;

		return true;
	}

	protected override getStopDistance(): number {
		return Shooter.ATTACK_RANGE * 0.8;
	}
}
