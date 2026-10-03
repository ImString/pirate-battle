import { formatTime } from '@/utils/helper-common';
import { useState } from 'react';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Modal } from '@/components/ui/Modal';

import type { ScreenPage } from '@/types/global';

export interface HistoryEntry {
	id: string;
	date: string;
	time: string;
	points: number;
	duration: number;
	result: 'time-up' | 'defeated';
}

interface HistoryScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
	entries?: readonly HistoryEntry[];
}

const PAGE_SIZE = 5;
const EMPTY_ENTRIES: readonly HistoryEntry[] = [];

const TAB_CLASSES =
	'compact-landscape:h-[clamp(40px,5.8dvh,58px)] compact-landscape:text-[clamp(12px,2dvh,20px)] h-[clamp(40px,5.8dvh,58px)] w-[min(234px,46%)] text-[clamp(12px,2dvh,20px)] tracking-normal [@media(max-height:450px)]:h-8!';
const PAGE_BUTTON_CLASSES = 'size-[clamp(36px,4dvh,40px)] [@media(max-height:450px)]:size-7';
const CELL_CLASSES =
	'h-[clamp(32px,5.1dvh,51px)] border-t border-t-transparent border-b border-b-black/20 px-[clamp(8px,0.8vw,14px)] text-[clamp(12px,1.8dvh,18px)] font-extrabold first:rounded-l-lg last:rounded-r-lg [&+td]:border-l [&+td]:border-l-[rgb(110_139_153/6%)] [@media(max-height:450px)]:h-5.5 [@media(max-height:450px)]:text-[11px]';

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigate, entries = EMPTY_ENTRIES }) => {
	const [page, setPage] = useState(1);
	const pageCount = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const visibleEntries = entries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<Screen className="bg-[url(/assets/ui_scene_background.png)] bg-cover bg-center bg-no-repeat">
			<div className="pointer-events-none absolute inset-0 bg-black/25" />

			<Modal className="font-pirate compact-landscape:w-[min(1410px,100%)] compact-landscape:border-x-[clamp(18px,2.5vw,32px)] compact-landscape:border-y-[clamp(20px,3.8dvh,38px)] compact-landscape:px-[clamp(8px,2vw,36px)] compact-landscape:py-[clamp(8px,1.2dvh,12px)] compact-landscape:lg:w-[min(1410px,88vw)] grid aspect-auto h-[min(740px,100%)] w-[min(1410px,100%)] grid-rows-[auto_auto_auto_minmax(0,1fr)_auto_auto] justify-items-center gap-[clamp(8px,1.3dvh,13px)] overflow-hidden border-x-[clamp(18px,2.5vw,32px)] border-y-[clamp(20px,3.8dvh,38px)] px-[clamp(8px,2vw,36px)] py-[clamp(8px,1.2dvh,12px)] text-[#fff0ce] lg:w-[min(1410px,88vw)] [@media(max-height:450px)]:gap-1 [@media(max-height:450px)]:border-18! [@media(max-height:450px)]:px-2! [@media(max-height:450px)]:py-1!">
				<h1 className="m-0 text-center text-[clamp(24px,4dvh,40px)] leading-[1.1] font-black uppercase [text-shadow:0_2px_0_#142735] [@media(max-height:450px)]:text-xl">
					Captain's Log
				</h1>

				<nav
					className="flex w-full justify-center gap-[clamp(8px,1.6vw,28px)]"
					aria-label="Captain's log sections">
					<Button variant="secondary" className={TAB_CLASSES} onClick={() => navigate('ranking')}>
						Ranking
					</Button>
					<Button variant="primary" className={TAB_CLASSES}>
						<span aria-current="page">Match History</span>
					</Button>
				</nav>

				<p className="text-[clamp(10px,1.4dvh,14px)] font-extrabold text-[#bfced3] uppercase [@media(max-height:450px)]:text-[10px]">
					Capitain Jack ● Your Recent Battles
				</p>

				<div
					className="min-h-0 w-full scrollbar-thin [scrollbar-color:#b88a43_#172a36] overflow-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
					tabIndex={0}
					aria-label="Recent battles">
					<table className="w-full table-fixed border-separate border-spacing-x-0 border-spacing-y-[clamp(5px,0.8dvh,8px)] text-left text-[#fff0ce] [@media(max-height:450px)]:border-spacing-y-0.75">
						<caption className="sr-only">
							Match history, page {currentPage} of {pageCount}
						</caption>
						<colgroup>
							<col className="w-[34%] max-[600px]:w-[30%]" />
							<col className="w-[20%] max-[600px]:w-[18%]" />
							<col className="w-[24%] max-[600px]:w-[25%]" />
							<col className="w-[22%] max-[600px]:w-[27%]" />
						</colgroup>
						<thead className="[&_th]:px-[clamp(8px,0.8vw,14px)] [&_th]:pb-[clamp(4px,0.6dvh,6px)] [&_th]:text-[clamp(9px,1.2dvh,12px)] [&_th]:font-extrabold [&_th]:tracking-widest [&_th]:text-[#bfced3] [&_th]:uppercase [@media(max-height:450px)]:[&_th]:pb-0.5 [@media(max-height:450px)]:[&_th]:text-[9px]">
							<tr>
								<th scope="col">Date</th>
								<th scope="col">Points</th>
								<th scope="col">Duration</th>
								<th scope="col">Result</th>
							</tr>
						</thead>
						<tbody>
							{visibleEntries.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="h-[clamp(150px,28dvh,280px)] rounded-lg border border-[rgb(170_197_211/12%)] bg-[rgb(10_27_38/65%)] px-[clamp(8px,0.8vw,14px)] text-[clamp(12px,1.8dvh,18px)] font-extrabold [@media(max-height:450px)]:h-25 [@media(max-height:450px)]:text-[11px]">
										<div
											className="flex flex-col items-center justify-center gap-[clamp(8px,1.2dvh,12px)] p-4 text-center [@media(max-height:450px)]:gap-1 [@media(max-height:450px)]:p-2"
											role="status">
											<img
												className="h-[clamp(36px,6.4dvh,64px)] w-auto drop-shadow-[0_3px_3px_rgb(0_0_0/30%)] [@media(max-height:450px)]:h-7"
												src="/assets/png/default/ships/ship_2.png"
												alt=""
												aria-hidden="true"
											/>
											<p className="text-[#ffe4a6]">No battles recorded yet</p>
											<span className="text-[clamp(11px,1.4dvh,14px)] font-normal text-[#aec2cc]">
												Your match history is empty.
											</span>
										</div>
									</td>
								</tr>
							) : (
								visibleEntries.map((entry, index) => (
									<tr
										key={entry.id}
										className={
											currentPage === 1 && index === 0
												? '[&>td]:border-[rgb(219_171_66/28%)] [&>td]:bg-[rgb(186_145_49/25%)]'
												: '[&>td]:bg-[rgb(10_27_38/65%)]'
										}>
										<td className={CELL_CLASSES}>
											<span className="uppercase">{entry.date}</span>
											<span className="text-[clamp(10px,1.4dvh,14px)] whitespace-nowrap text-[#aec2cc] max-[600px]:block">
												{' '}
												· {entry.time}
											</span>
										</td>
										<td className={`${CELL_CLASSES} text-[#ffd275]`}>{entry.points}</td>
										<td className={CELL_CLASSES}>{formatTime(entry.duration)}</td>
										<td className={CELL_CLASSES}>
											<span
												className={`text-[clamp(9px,1.2dvh,12px)] uppercase ${entry.result === 'time-up' ? 'text-[#bfdfac]' : 'text-[#ffad98]'}`}>
												{entry.result === 'time-up' ? 'Time Up' : 'Defeated'}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<nav
					className="flex items-center gap-[clamp(12px,1.2vw,20px)] text-[clamp(10px,1.4dvh,14px)] font-extrabold text-[#bfced3] uppercase"
					aria-label="Match history pagination">
					<IconButton
						className={PAGE_BUTTON_CLASSES}
						iconClassName="size-2/5! object-contain"
						iconSrc="/assets/png/default/ui/controls/icon_turn_left.png"
						aria-label="Previous page"
						disabled={currentPage === 1}
						onClick={() => setPage(currentPage - 1)}
					/>
					<p className="min-w-20 text-center" aria-live="polite" aria-atomic="true">
						Page {currentPage} of {pageCount}
					</p>
					<IconButton
						className={PAGE_BUTTON_CLASSES}
						iconClassName="size-2/5! object-contain"
						iconSrc="/assets/png/default/ui/controls/icon_turn_right.png"
						aria-label="Next page"
						disabled={currentPage === pageCount}
						onClick={() => setPage(currentPage + 1)}
					/>
				</nav>

				<Button
					className="compact-landscape:h-[clamp(44px,6.8dvh,68px)] compact-landscape:text-[clamp(16px,2.4dvh,24px)] h-[clamp(44px,6.8dvh,68px)] w-[min(280px,70%)] text-[clamp(16px,2.4dvh,24px)] [@media(max-height:450px)]:h-9!"
					onClick={() => navigate('menu')}>
					Main Menu
				</Button>
			</Modal>
		</Screen>
	);
};
