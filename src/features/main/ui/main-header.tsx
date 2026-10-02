export const MainHeader: React.FC<{}> = () => {
	return (
		<>
			<div className="mb-4">
				<img
					src="/assets/png/default/ui/menu/title_pirate_battle.png"
					alt="Pirate Battle"
					className="w-72 object-contain drop-shadow-md md:w-80"
				/>
			</div>
			<p className="mb-6 text-xs font-bold tracking-widest text-amber-200/80 uppercase">
				Set Sail. Take Command.
			</p>
		</>
	);
};
