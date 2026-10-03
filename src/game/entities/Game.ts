import type { GameState, MoveDirection } from '@/types/game';
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

	constructor() {
		this.score = 0;
		this.time = 120;

		this.players = [];
		this.enemies = [];
	}

	public addPlayer(player: Player) {
		this.players.push(player);
		this.boatDirections.set(player, new Set());
	}

	public addEnemy(enemy: Shooter | Chaser) {
		this.enemies.push(enemy);
		this.boatDirections.set(enemy, new Set());
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

	public update(deltaTime: number) {
		if (this.state !== 'running') return;

		for (const [boat, directions] of this.boatDirections) {
			boat.update(deltaTime, directions);
		}
	}
}
