import type { Position } from '@/types/game';

export class Explosion {
	private static nextId = 0;
	private static readonly DURATION = 0.6;
	private readonly id = Explosion.nextId++;
	private position: Position;
	private age: number = 0;

	constructor(position: Position) {
		this.position = { ...position };
	}

	public update(deltaTime: number) {
		this.age += deltaTime;
	}

	public getId() {
		return this.id;
	}

	public getPosition() {
		return { ...this.position };
	}

	public getProgress() {
		return Math.min(1, this.age / Explosion.DURATION);
	}

	public isActive() {
		return this.age < Explosion.DURATION;
	}
}
