import type { Position } from '@/types/game';

import { MAP_ISLANDS, getIslandOrigin } from '../map/MapLayout';
import { TERRAIN_MASKS } from '../map/TerrainMasks';

const TILE_SIZE = 64;

const terrainMasks = new Map(
	Object.entries(TERRAIN_MASKS).map(([texture, encoded]) => [
		texture,
		Uint8Array.from(atob(encoded), character => character.charCodeAt(0))
	])
);

interface TerrainCollider {
	x: number;
	y: number;
	scale: number;
	mask: Uint8Array;
}

export class MapCollision {
	private terrain: TerrainCollider[] = [];
	private width: number = 0;
	private height: number = 0;

	public resize(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.terrain = MAP_ISLANDS.flatMap(island => {
			const origin = getIslandOrigin(island, width, height);

			return island.tiles.flatMap(tile => {
				const mask = terrainMasks.get(tile.texture);

				if (!mask) return [];

				return [
					{
						x: origin.x + tile.x * island.scale,
						y: origin.y + tile.y * island.scale,
						scale: island.scale,
						mask
					}
				];
			});
		});
	}

	public isBlocked(position: Position, radius: number) {
		return this.terrain.some(tile => {
			const localX = (position.x - tile.x) / tile.scale;
			const localY = (position.y - tile.y) / tile.scale;
			const localRadius = radius / tile.scale;
			const minX = Math.max(0, Math.floor(localX - localRadius));
			const maxX = Math.min(TILE_SIZE - 1, Math.floor(localX + localRadius));
			const minY = Math.max(0, Math.floor(localY - localRadius));
			const maxY = Math.min(TILE_SIZE - 1, Math.floor(localY + localRadius));

			for (let y = minY; y <= maxY; y++) {
				for (let x = minX; x <= maxX; x++) {
					const bit = y * TILE_SIZE + x;

					if ((tile.mask[bit >> 3] & (1 << (bit & 7))) === 0) continue;

					const closestX = Math.max(x, Math.min(localX, x + 1));
					const closestY = Math.max(y, Math.min(localY, y + 1));

					if ((localX - closestX) ** 2 + (localY - closestY) ** 2 <= localRadius ** 2) {
						return true;
					}
				}
			}

			return false;
		});
	}

	public isOutsideMap(position: Position, halfSize: Position) {
		if (this.width === 0 || this.height === 0) return false;

		return (
			position.x - halfSize.x < 0 ||
			position.x + halfSize.x > this.width ||
			position.y - halfSize.y < 0 ||
			position.y + halfSize.y > this.height
		);
	}

	public constrainToMap(position: Position, halfSize: Position): Position {
		if (this.width === 0 || this.height === 0) return position;

		return {
			x: Math.max(halfSize.x, Math.min(position.x, this.width - halfSize.x)),
			y: Math.max(halfSize.y, Math.min(position.y, this.height - halfSize.y))
		};
	}

	public findSpawnPosition(
		preferred: Position,
		radius: number,
		halfSize: Position = { x: radius, y: radius }
	): Position | null {
		if (this.width === 0 || this.height === 0) return null;

		const isAvailable = (position: Position) =>
			!this.isOutsideMap(position, halfSize) &&
			!this.isOutsideMap({ x: position.x, y: position.y + 64 }, halfSize) &&
			!this.isBlocked(position, radius) &&
			!this.isBlocked({ x: position.x, y: position.y + 32 }, radius) &&
			!this.isBlocked({ x: position.x, y: position.y + 64 }, radius);

		if (isAvailable(preferred)) return preferred;

		let closest: Position | null = null;
		let closestDistance = Infinity;

		for (let y = halfSize.y; y <= this.height - halfSize.y - 64; y += 8) {
			for (let x = halfSize.x; x <= this.width - halfSize.x; x += 8) {
				const position = { x, y };
				const distance = (x - preferred.x) ** 2 + (y - preferred.y) ** 2;

				if (distance < closestDistance && isAvailable(position)) {
					closest = position;
					closestDistance = distance;
				}
			}
		}

		return closest;
	}
}
