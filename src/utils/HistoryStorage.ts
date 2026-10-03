import type { HistoryEntry } from '@/types/history';

export const HISTORY_STORAGE_KEY = 'pirate-battle:history';
export const HISTORY_LIMIT = 100;

const isHistoryEntry = (value: unknown): value is HistoryEntry => {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;

	const entry = value as Record<string, unknown>;
	return (
		typeof entry.id === 'string' &&
		entry.id.length > 0 &&
		typeof entry.completedAt === 'string' &&
		Number.isFinite(Date.parse(entry.completedAt)) &&
		typeof entry.points === 'number' &&
		Number.isSafeInteger(entry.points) &&
		entry.points >= 0 &&
		typeof entry.duration === 'number' &&
		Number.isSafeInteger(entry.duration) &&
		entry.duration >= 0 &&
		(entry.result === 'time-up' || entry.result === 'defeated')
	);
};

export const loadHistory = (): HistoryEntry[] => {
	try {
		if (typeof window === 'undefined') return [];

		const saved = window.localStorage.getItem(HISTORY_STORAGE_KEY);
		if (saved === null) return [];

		const parsed: unknown = JSON.parse(saved);
		if (!Array.isArray(parsed)) return [];

		const seenIds = new Set<string>();
		return parsed
			.filter(isHistoryEntry)
			.sort((first, second) => Date.parse(second.completedAt) - Date.parse(first.completedAt))
			.filter(entry => {
				if (seenIds.has(entry.id)) return false;
				seenIds.add(entry.id);
				return true;
			})
			.slice(0, HISTORY_LIMIT);
	} catch {
		return [];
	}
};

export const saveHistory = (entries: readonly HistoryEntry[]): boolean => {
	try {
		if (typeof window === 'undefined') return false;

		window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)));
		return true;
	} catch {
		return false;
	}
};
