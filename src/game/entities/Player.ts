import type { AttackDirection, Position } from '@/types/game';

import { Boat } from './Boat';
import { Projectile } from './Projectile';

const ATTACK_DIRECTIONS: readonly AttackDirection[] = ['front', 'left', 'right'];

export class Player extends Boat {
	private static readonly SHOT_INTERVALS: Record<AttackDirection, number> = {
		front: 0.4,
		left: 0.9,
		right: 0.9
	};
	private static readonly MUZZLE_CLEARANCE = 8;
	private static readonly SIDE_SHOT_SPACING = 30;

	private readonly shotCooldowns: Record<AttackDirection, number> = { front: 0, left: 0, right: 0 };

	constructor(startX: number, startY: number) {
		super(startX, startY, 'player');
	}

	public updateAttacks(deltaTime: number, directions: ReadonlySet<AttackDirection>): Projectile[] {
		if (!this.isAlive() || !Number.isFinite(deltaTime) || deltaTime <= 0) return [];

		const projectiles: Projectile[] = [];
		for (const direction of ATTACK_DIRECTIONS) {
			this.shotCooldowns[direction] = Math.max(0, this.shotCooldowns[direction] - deltaTime);
			if (!directions.has(direction) || this.shotCooldowns[direction] > 1e-8) continue;

			projectiles.push(...this.createShot(direction));
			this.shotCooldowns[direction] = Player.SHOT_INTERVALS[direction];
		}

		return projectiles;
	}

	private createShot(direction: AttackDirection): Projectile[] {
		const rotation = this.getRotation();
		const forward = { x: -Math.sin(rotation), y: Math.cos(rotation) };
		const left = { x: Math.cos(rotation), y: Math.sin(rotation) };
		const hull = this.getBoundaryHalfSize(0);
		const origin = this.getPosition();

		if (direction === 'front') {
			const position = {
				x: origin.x + forward.x * (hull.y + Player.MUZZLE_CLEARANCE),
				y: origin.y + forward.y * (hull.y + Player.MUZZLE_CLEARANCE)
			};
			return [this.createProjectile(position, forward)];
		}

		const side = direction === 'left' ? left : { x: -left.x, y: -left.y };
		return [-1, 0, 1].map(index => {
			const offset = index * Player.SIDE_SHOT_SPACING;
			const position = {
				x: origin.x + side.x * (hull.x + Player.MUZZLE_CLEARANCE) + forward.x * offset,
				y: origin.y + side.y * (hull.x + Player.MUZZLE_CLEARANCE) + forward.y * offset
			};
			return this.createProjectile(position, side);
		});
	}

	private createProjectile(position: Position, direction: Position): Projectile {
		return new Projectile(position, { x: position.x + direction.x, y: position.y + direction.y }, 'player');
	}
}
