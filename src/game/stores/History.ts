import { HISTORY_LIMIT, loadHistory, saveHistory } from '@/utils/HistoryStorage';
import { create } from 'zustand';

import type { HistoryEntry } from '@/types/history';

interface HistoryState {
	entries: readonly HistoryEntry[];
	historySaveFailed: boolean;
	recordMatch: (entry: HistoryEntry) => void;
}

export const useHistoryStore = create<HistoryState>()((set, get) => ({
	entries: loadHistory(),
	historySaveFailed: false,
	recordMatch: entry => {
		const currentEntries = get().entries;
		if (currentEntries.some(current => current.id === entry.id)) return;

		const entries = [entry, ...currentEntries].slice(0, HISTORY_LIMIT);
		const saved = saveHistory(entries);
		set({ entries, historySaveFailed: !saved });
	}
}));
