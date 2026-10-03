import type { GameState, MoveDirection } from '@/types/game';

import { MapCollision } from '../collision/MapCollision';
import type { Boat } from './Boat';
import type { Chaser } from './Chaser';
import type { Player } from './Player';
import type { Shooter } from './Shooter';

export class Game {
	public score: number = 0;
	public time: number = 0;
	public players: Player[] = [];
	public enemies: Boat[] = [];
	public state: GameState = 'running';
	private boatDirections: Map<Boat, Set<MoveDirection>> = new Map();
	private mapCollision: MapCollision = new MapCollision();

	constructor() {
		this.score = 0;
		this.time = 120;

		this.players = [];
		this.enemies = [];
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
		this.mapCollision.resize(width, height);

		for (const boat of this.boatDirections.keys()) {
			if (
				this.mapCollision.isBlocked(boat.getPosition(), boat.getCollisionRadius()) ||
				this.mapCollision.isOutsideMap(boat.getPosition(), boat.getBoundaryHalfSize())
			) {
				this.placeBoatInWater(boat);
			}
		}
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
		if (this.state !== 'running') return;

		for (const [boat, directions] of this.boatDirections) {
			boat.update(
				deltaTime,
				directions,
				(position, rotation) =>
					!this.mapCollision.isOutsideMap(position, boat.getBoundaryHalfSize(rotation)) &&
					!this.mapCollision.isBlocked(position, boat.getCollisionRadius()),
				(position, rotation) => this.mapCollision.constrainToMap(position, boat.getBoundaryHalfSize(rotation))
			);
		}
	}
}
