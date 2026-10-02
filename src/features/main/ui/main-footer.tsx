import { WoodButton } from '@/shared/ui';

export const MainFooter: React.FC<{}> = () => {
	return (
		<>
			<div>
				<img
					src="/assets/png/default/ships/ship_2.png"
					alt="Pirate Ship"
					className="h-16 w-10 object-contain drop-shadow"
				/>
				<span className="text-xs font-semibold tracking-wide text-amber-100/70">
					Navigate the islands. Survive the battle.
				</span>
			</div>

			<div className="flex w-full flex-wrap items-center justify-center gap-3">
				<WoodButton>Ranking</WoodButton>
				<WoodButton>Match History</WoodButton>
			</div>
		</>
	);
};
