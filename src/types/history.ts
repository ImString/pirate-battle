export interface HistoryEntry {
	id: string;
	completedAt: string;
	points: number;
	duration: number;
	result: 'time-up' | 'defeated';
}
