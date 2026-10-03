import type { FinishReason, GameConfig, GameState, MoveDirection, Position } from '@/types/game';

import { MapCollision } from '../collision/MapCollision';
import { resolveGameConfig } from '../config';
import type { Boat } from './Boat';
import { Chaser } from './Chaser';
import type { Enemy } from './Enemy';
import { Explosion } from './Explosion';
import type { Player } from './Player';
import { Projectile } from './Projectile';
import { Shooter } from './Shooter';

export class Game {
	public score: number = 0;
	public time: number = 0;
	public players: Player[] = [];
	public enemies: Enemy[] = [];
	public projectiles: Projectile[] = [];
	public explosions: Explosion[] = [];
	public state: GameState = 'running';
	public finishReason: FinishReason | null = null;
	public readonly config: Readonly<GameConfig>;
	private boatDirections: Map<Boat, Set<MoveDirection>> = new Map();
	private mapCollision: MapCollision = new MapCollision();
	private elapsedTime: number = 0;
	private spawnElapsedTime: number = 0;
	private nextEnemyType: 'chaser' | 'shooter' = 'chaser';

	constructor(config: Partial<GameConfig> = {}) {
		this.config = Object.freeze(resolveGameConfig(config));
		this.time = Math.ceil(this.config.duration);
	}

	public getElapsedTime() {
		return this.elapsedTime;
	}

	public addPlayer(player: Player) {
		this.players.push(player);
		this.boatDirections.set(player, new Set());
		this.placeBoatInWater(player);
	}

	public addEnemy(enemy: Shooter | Chaser) {
		this.enemies.push(enemy);
		this.boatDirections.set(enemy, new Set());
		this.placeBoatInWater(enemy);
	}

	public setBoatDirection(boat: Boat, direction: MoveDirection, isActive: boolean) {
		if (this.state !== 'running') return;

		const directions = this.boatDirections.get(boat);

		if (!directions) return;

		if (isActive) {
			directions.add(direction);
		} else {
			directions.delete(direction);
		}
	}

	public clearBoatDirections(boat: Boat) {
		this.boatDirections.get(boat)?.clear();
	}

	public setMapSize(width: number, height: number) {
		if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;

		this.mapCollision.resize(width, height);

		for (const player of this.players) {
			if (!this.canBoatMoveTo(player, player.getPosition(), player.getRotation())) this.placeBoatInWater(player);
		}

		for (const enemy of [...this.enemies]) {
			if (this.canBoatMoveTo(enemy, enemy.getPosition(), enemy.getRotation())) continue;

			const position = this.findEnemySpawnPosition(enemy);
			if (position) enemy.setPosition(position);
			else this.removeEnemy(enemy);
		}

		this.projectiles = this.projectiles.filter(projectile =>
			this.canProjectileMoveTo(projectile, projectile.getPosition())
		);
	}

	private placeBoatInWater(boat: Boat) {
		const position = this.mapCollision.findSpawnPosition(
			boat.getPosition(),
			boat.getCollisionRadius(),
			boat.getBoundaryHalfSize()
		);

		if (position) boat.setPosition(position);
	}

	public update(deltaTime: number) {
		if (this.state !== 'running' || !Number.isFinite(deltaTime) || deltaTime <= 0) return;

		let remainingTime = Math.min(deltaTime, this.config.duration - this.elapsedTime);

		while (remainingTime > 0 && this.state === 'running') {
			const stepTime = Math.min(remainingTime, 1 / 60);
			this.updateStep(stepTime);
			remainingTime -= stepTime;
		}
	}

	private updateStep(deltaTime: number) {
		if (this.players.length > 0 && this.players.every(player => !player.isAlive())) {
			this.finish('defeat');
			return;
		}

		this.elapsedTime = Math.min(this.config.duration, this.elapsedTime + deltaTime);
		this.time = Math.ceil(Math.max(0, this.config.duration - this.elapsedTime - 1e-8));

		for (const explosion of this.explosions) explosion.update(deltaTime);
		this.explosions = this.explosions.filter(explosion => explosion.isActive());

		for (const enemy of [...this.enemies]) {
			if (!enemy.isAlive()) this.removeEnemy(enemy, true);
		}

		for (const [boat, directions] of this.boatDirections) {
			if (boat.getType() !== 'player' || !boat.isAlive()) continue;

			boat.update(
				deltaTime,
				directions,
				(position, rotation) => this.canBoatMoveTo(boat, position, rotation),
				(position, rotation) => this.mapCollision.constrainToMap(position, boat.getBoundaryHalfSize(rotation))
			);
		}

		for (const enemy of [...this.enemies]) {
			const target = this.findTarget(enemy);
			if (!target) continue;

			const canMoveTo = (position: Position, rotation: number) => this.canBoatMoveTo(enemy, position, rotation);
			enemy.update(
				deltaTime,
				enemy.getDirections(target.getPosition(), deltaTime, canMoveTo),
				canMoveTo,
				(position, rotation) => this.mapCollision.constrainToMap(position, enemy.getBoundaryHalfSize(rotation))
			);

			if (enemy instanceof Chaser) {
				const collidedPlayer = this.players.find(
					player => player.isAlive() && this.boatsOverlap(enemy, player)
				);
				if (collidedPlayer) {
					collidedPlayer.takeDamage(enemy.getCollisionDamage());
					enemy.takeDamage(enemy.getMaxHealth());
					this.removeEnemy(enemy, true);
				}
			} else if (enemy instanceof Shooter) {
				const targetPosition = target.getPosition();
				const position = enemy.getPosition();
				const inRange =
					Math.hypot(targetPosition.x - position.x, targetPosition.y - position.y) <= enemy.getAttackRange();
				const hasLineOfSight = inRange && !this.mapCollision.isPathBlocked(position, targetPosition, 6);
				if (enemy.tryShoot(targetPosition, deltaTime, hasLineOfSight)) {
					this.projectiles.push(new Projectile(enemy.getPosition(), targetPosition));
				}
			}
		}

		for (const projectile of this.projectiles) {
			projectile.update(
				deltaTime,
				position => this.canProjectileMoveTo(projectile, position),
				position => {
					const player = this.players.find(candidate => {
						const target = candidate.getPosition();
						return (
							candidate.isAlive() &&
							Math.hypot(target.x - position.x, target.y - position.y) <=
								candidate.getCollisionRadius() + projectile.getCollisionRadius()
						);
					});

					if (!player) return false;
					player.takeDamage(projectile.getDamage());
					return true;
				}
			);
		}
		this.projectiles = this.projectiles.filter(projectile => projectile.isActive());

		if (this.players.length > 0 && this.players.every(player => !player.isAlive())) {
			this.finish('defeat');
			return;
		}
		if (this.time === 0) {
			this.finish('time');
			return;
		}

		const { width, height } = this.mapCollision.getSize();
		if (width === 0 || height === 0 || !this.players.some(player => player.isAlive())) return;

		this.spawnElapsedTime += deltaTime;
		if (this.spawnElapsedTime + 1e-8 >= this.config.enemySpawnInterval) {
			this.spawnElapsedTime = Math.max(0, this.spawnElapsedTime - this.config.enemySpawnInterval);
			this.spawnEnemy();
		}
	}

	private canBoatMoveTo(boat: Boat, position: Position, rotation: number) {
		return (
			!this.mapCollision.isOutsideMap(position, boat.getBoundaryHalfSize(rotation)) &&
			!this.mapCollision.isBlocked(position, boat.getCollisionRadius())
		);
	}

	private canProjectileMoveTo(projectile: Projectile, position: Position) {
		const radius = projectile.getCollisionRadius();
		return (
			!this.mapCollision.isOutsideMap(position, { x: radius, y: radius }) &&
			!this.mapCollision.isBlocked(position, radius)
		);
	}

	private findTarget(enemy: Enemy) {
		const position = enemy.getPosition();
		return this.players
			.filter(player => player.isAlive())
			.reduce<Player | null>((closest, player) => {
				if (!closest) return player;
				const candidate = player.getPosition();
				const current = closest.getPosition();
				return Math.hypot(candidate.x - position.x, candidate.y - position.y) <
					Math.hypot(current.x - position.x, current.y - position.y)
					? player
					: closest;
			}, null);
	}

	private boatsOverlap(first: Boat, second: Boat) {
		const from = first.getPosition();
		const to = second.getPosition();
		return Math.hypot(to.x - from.x, to.y - from.y) <= first.getCollisionRadius() + second.getCollisionRadius();
	}

	private findEnemySpawnPosition(enemy: Enemy) {
		const { width, height } = this.mapCollision.getSize();
		if (width === 0 || height === 0 || !this.players.some(player => player.isAlive())) return null;

		const halfSize = enemy.getBoundaryHalfSize();
		const turningRadius = Math.hypot(halfSize.x, halfSize.y);
		return this.mapCollision.findSpawnPosition(
			{ x: Math.random() * width, y: Math.random() * height },
			enemy.getCollisionRadius(),
			{ x: turningRadius, y: turningRadius },
			position =>
				this.players.every(player => {
					const target = player.getPosition();
					const minimumDistance = Math.max(
						this.config.enemySpawnDistance,
						enemy.getCollisionRadius() + player.getCollisionRadius() + 180,
						enemy instanceof Shooter
							? enemy.getAttackRange() + player.getCollisionRadius() + enemy.getCollisionRadius()
							: 0
					);
					return Math.hypot(target.x - position.x, target.y - position.y) >= minimumDistance;
				}) &&
				this.enemies.every(other => {
					if (other === enemy) return true;
					const target = other.getPosition();
					return (
						Math.hypot(target.x - position.x, target.y - position.y) >=
						other.getCollisionRadius() + enemy.getCollisionRadius() + 32
					);
				})
		);
	}

	private spawnEnemy() {
		const enemy = this.nextEnemyType === 'chaser' ? new Chaser(0, 0) : new Shooter(0, 0);
		const position = this.findEnemySpawnPosition(enemy);
		if (!position) return;

		enemy.setPosition(position);
		this.addEnemy(enemy);
		this.nextEnemyType = this.nextEnemyType === 'chaser' ? 'shooter' : 'chaser';
	}

	private removeEnemy(enemy: Enemy, explode: boolean = false) {
		if (explode) this.explosions.push(new Explosion(enemy.getPosition()));
		this.enemies = this.enemies.filter(candidate => candidate !== enemy);
		this.boatDirections.delete(enemy);
	}

	private finish(reason: FinishReason) {
		this.state = 'finished';
		this.finishReason = reason;
		for (const directions of this.boatDirections.values()) directions.clear();
		if (reason === 'defeat') {
			for (const player of this.players) this.explosions.push(new Explosion(player.getPosition()));
		}
	}
}
