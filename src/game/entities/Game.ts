import type { Boat } from './Boat';
import type { Chaser } from './Chaser';
import type { Player } from './Player';
import type { Shooter } from './Shooter';

export class Game {
	public score: number = 0;
	public time: number = 0;
	public players: Player[] = [];
	public enemies: Boat[] = [];
	public isPaused: boolean = false;

	constructor() {
		this.score = 0;
		this.time = 120;

		this.players = [];
		this.enemies = [];
	}

	public addPlayer(player: Player) {
		this.players.push(player);
	}

	public addEnemy(enemy: Shooter | Chaser) {
		this.enemies.push(enemy);
	}
}
