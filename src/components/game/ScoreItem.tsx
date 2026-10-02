interface ScoreItemProps {
	icon: string;
	score: number | string;
}

export const ScoreItem: React.FC<ScoreItemProps> = props => {
	return (
		<div className="flex h-14 min-w-44 items-center justify-center gap-2 bg-[url(/assets/png/default/ui/hud/counter_panel.png)] bg-size-[100%_100%] bg-no-repeat">
			<img src={props.icon} alt="Score Icon" className="h-7 w-7 object-contain" />
			<span className="-translate-y-0.5 text-xl font-bold text-amber-100">{props.score}</span>
		</div>
	);
};
