import { Modal } from '@/components/ui/Modal';

interface LoadingScreenProps {
	title?: string;
	description?: string;
	progress?: number;
	onRetry?: () => void;
	artworkReady?: boolean;
}

export const LoadingScreen = ({
	title = 'LOADING...',
	description,
	progress,
	onRetry,
	artworkReady = true
}: LoadingScreenProps) => {
	const percentage = progress === undefined ? undefined : Math.round(Math.min(100, Math.max(0, progress)));
	const content = (
		<>
			{artworkReady ? (
				<img
					src="/assets/png/default/ui/menu/title_pirate_battle.png"
					alt="Pirate Battle"
					className="max-h-[20dvh] w-4/5 max-w-80 object-contain"
				/>
			) : (
				<p className="text-[clamp(22px,5dvh,36px)] font-extrabold tracking-wide text-amber-200">
					Pirate Battle
				</p>
			)}
			{!onRetry && (
				<div
					className="relative grid size-[clamp(48px,12dvh,80px)] shrink-0 place-items-center"
					aria-hidden="true">
					<span className="border-t-pirate-gold absolute inset-0 rounded-full border-3 border-amber-200/20 motion-safe:animate-spin" />
					{artworkReady && (
						<img src="/assets/png/default/ships/ship_2.png" alt="" className="h-3/5 w-3/5 object-contain" />
					)}
				</div>
			)}
			<div className="flex flex-col gap-2">
				<h1 className="text-shadow text-[clamp(18px,4dvh,28px)] font-extrabold tracking-widest text-amber-200">
					{title}
				</h1>
				{description && (
					<p className="text-[clamp(12px,2.4dvh,16px)] font-semibold text-amber-100/80">{description}</p>
				)}
			</div>
			{percentage !== undefined && (
				<div className="flex w-full max-w-80 flex-col gap-2">
					<progress
						role="progressbar"
						aria-label="Loading images"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={percentage}
						value={percentage}
						max={100}
						className="h-2 w-full overflow-hidden rounded-full border-0 bg-amber-200/20 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-amber-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-amber-200/20 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-amber-200"
					/>
					<span className="text-sm font-semibold text-amber-100/80" aria-hidden="true">
						{percentage}%
					</span>
				</div>
			)}
			{onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className="cursor-pointer rounded-lg border border-amber-200/60 bg-amber-200 px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 active:bg-amber-300">
					Try again
				</button>
			)}
		</>
	);

	return (
		<div
			className={`bg-ocean-dark absolute inset-0 z-40 flex items-center justify-center bg-cover bg-center p-[max(12px,env(safe-area-inset-top),env(safe-area-inset-right),env(safe-area-inset-bottom),env(safe-area-inset-left))] ${artworkReady ? 'bg-[url(/assets/ui_scene_background.png)]' : ''}`}
			role="status"
			aria-live="polite"
			aria-busy={!onRetry}>
			<div className="pointer-events-none absolute inset-0 bg-black/25" />
			{artworkReady ? (
				<Modal className="compact-landscape:max-w-130 flex aspect-auto w-full max-w-130 flex-col items-center gap-[clamp(12px,3dvh,24px)] text-center">
					{content}
				</Modal>
			) : (
				<div className="relative flex max-h-full w-full max-w-130 flex-col items-center gap-[clamp(12px,3dvh,24px)] overflow-auto rounded-2xl border border-amber-200/20 bg-slate-950/70 p-[clamp(20px,5dvh,40px)] text-center text-white shadow-xl">
					{content}
				</div>
			)}
		</div>
	);
};
