import type { BoatType, MoveDirection, Position } from '@/types/game';

import { Boat } from './Boat';

interface NavigationNode {
	x: number;
	y: number;
	position: Position;
	distance: number;
	estimate: number;
	parent: NavigationNode | null;
}

export class Enemy extends Boat {
	private static readonly PATH_INTERVAL = 1;
	private static readonly PATH_STEP = 28;
	private static readonly TARGET_REFRESH_DISTANCE = 56;
	private static readonly MAX_PATH_NODES = 600;

	private path: Position[] = [];
	private pathTarget: Position | null = null;
	private pathCooldown: number = 0;

	constructor(startX: number, startY: number, type: Exclude<BoatType, 'player'>, moveSpeed: number) {
		super(startX, startY, type, moveSpeed, Math.PI);
	}

	public getDirections(
		target: Position,
		deltaTime: number,
		canMoveTo: (position: Position, rotation: number) => boolean
	): ReadonlySet<MoveDirection> {
		const directions = new Set<MoveDirection>();

		if (!this.isAlive() || !Number.isFinite(deltaTime) || deltaTime <= 0) return directions;

		const position = this.getPosition();
		const distance = Math.hypot(target.x - position.x, target.y - position.y);
		const holdingPosition = distance <= this.getStopDistance() && this.canApproach(position, target, canMoveTo);

		this.pathCooldown -= deltaTime;

		if (
			!holdingPosition &&
			(this.pathCooldown <= 0 ||
				this.pathTarget === null ||
				Math.hypot(target.x - this.pathTarget.x, target.y - this.pathTarget.y) >= Enemy.TARGET_REFRESH_DISTANCE)
		) {
			this.path = this.findPath(target, canMoveTo);
			this.pathTarget = { ...target };
			this.pathCooldown = Enemy.PATH_INTERVAL;
		}

		while (
			this.path.length > 0 &&
			Math.hypot(this.path[0].x - position.x, this.path[0].y - position.y) <= Enemy.PATH_STEP / 3
		) {
			this.path.shift();
		}

		const waypoint = holdingPosition ? target : (this.path[0] ?? target);
		const angle = this.getAngleTo(waypoint);
		const difference = this.getAngleDifference(angle);
		const turnStep = this.getTurnSpeed() * deltaTime;
		const turnDirection = Math.abs(difference) > turnStep / 2 ? Math.sign(difference) : 0;

		if (turnDirection > 0) directions.add('turn-right');
		if (turnDirection < 0) directions.add('turn-left');

		if (!holdingPosition && Math.abs(difference) < Math.PI / 3) {
			const nextRotation = this.getRotation() + turnDirection * turnStep;
			const stepDistance = this.getMoveSpeed() * deltaTime;
			const nextPosition = {
				x: position.x - Math.sin(nextRotation) * stepDistance,
				y: position.y + Math.cos(nextRotation) * stepDistance
			};

			if (canMoveTo(nextPosition, nextRotation)) {
				directions.add('forward');
			} else {
				this.pathCooldown = 0;
			}
		}

		return directions;
	}

	protected getStopDistance(): number {
		return 0;
	}

	protected getAngleTo(target: Position): number {
		const position = this.getPosition();

		return Math.atan2(position.x - target.x, target.y - position.y);
	}

	protected getAngleDifference(angle: number): number {
		const difference = angle - this.getRotation();

		return Math.atan2(Math.sin(difference), Math.cos(difference));
	}

	private canTravel(
		from: Position,
		to: Position,
		canMoveTo: (position: Position, rotation: number) => boolean
	): boolean {
		const distance = Math.hypot(to.x - from.x, to.y - from.y);
		const steps = Math.max(1, Math.ceil(distance / 8));
		const rotation = Math.atan2(from.x - to.x, to.y - from.y);

		for (let step = 0; step <= steps; step++) {
			const progress = step === 0 ? Math.min(1, 2 / Math.max(distance, 1)) : step / steps;
			const position = {
				x: from.x + (to.x - from.x) * progress,
				y: from.y + (to.y - from.y) * progress
			};

			if (!canMoveTo(position, rotation)) return false;
		}

		return true;
	}

	private findPath(target: Position, canMoveTo: (position: Position, rotation: number) => boolean): Position[] {
		const start = this.getPosition();

		if (this.canApproach(start, target, canMoveTo)) return [{ ...target }];

		const startNode: NavigationNode = {
			x: 0,
			y: 0,
			position: start,
			distance: 0,
			estimate: Math.hypot(target.x - start.x, target.y - start.y),
			parent: null
		};
		const open = [startNode];
		const nodes = new Map<string, NavigationNode>([['0:0', startNode]]);
		const closed = new Set<string>();
		let closest = startNode;

		while (open.length > 0 && closed.size < Enemy.MAX_PATH_NODES) {
			open.sort((first, second) => first.distance + first.estimate - second.distance - second.estimate);
			const current = open.shift()!;
			const currentKey = `${current.x}:${current.y}`;

			if (closed.has(currentKey)) continue;

			closed.add(currentKey);

			if (current.estimate < closest.estimate) closest = current;

			if (current.estimate <= Enemy.PATH_STEP * 1.5 && this.canApproach(current.position, target, canMoveTo)) {
				return [...this.buildPath(current), { ...target }];
			}

			for (let y = -1; y <= 1; y++) {
				for (let x = -1; x <= 1; x++) {
					if (x === 0 && y === 0) continue;

					const nextX = current.x + x;
					const nextY = current.y + y;
					const key = `${nextX}:${nextY}`;
					const distance = current.distance + Math.hypot(x, y) * Enemy.PATH_STEP;

					if (closed.has(key) || (nodes.get(key)?.distance ?? Infinity) <= distance) continue;

					const position = {
						x: start.x + nextX * Enemy.PATH_STEP,
						y: start.y + nextY * Enemy.PATH_STEP
					};

					if (!this.canTravel(current.position, position, canMoveTo)) continue;

					const node: NavigationNode = {
						x: nextX,
						y: nextY,
						position,
						distance,
						estimate: Math.hypot(target.x - position.x, target.y - position.y),
						parent: current
					};

					nodes.set(key, node);
					open.push(node);
				}
			}
		}

		return this.buildPath(closest);
	}

	private canApproach(
		from: Position,
		target: Position,
		canMoveTo: (position: Position, rotation: number) => boolean
	): boolean {
		const distance = Math.hypot(target.x - from.x, target.y - from.y);
		const contactDistance = this.getCollisionRadius() * 2;

		if (distance <= contactDistance) return true;

		const progress = 1 - contactDistance / distance;

		return this.canTravel(
			from,
			{
				x: from.x + (target.x - from.x) * progress,
				y: from.y + (target.y - from.y) * progress
			},
			canMoveTo
		);
	}

	private buildPath(node: NavigationNode): Position[] {
		const path: Position[] = [];
		let current = node;

		while (current.parent !== null) {
			path.unshift(current.position);
			current = current.parent;
		}

		return path;
	}
}
