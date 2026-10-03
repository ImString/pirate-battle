interface ScoreItemProps {
	icon: string;
	score: number | string;
}

export const ScoreItem: React.FC<ScoreItemProps> = props => {
	return (
		<div className="score-item compact-hud:gap-1 flex h-[clamp(40px,10vh,56px)] w-[clamp(90px,14vw,176px)] items-center justify-center gap-2 bg-[url(/assets/png/default/ui/hud/counter_panel.png)] bg-size-[100%_100%] bg-no-repeat">
			<img src={props.icon} alt="Score Icon" className="compact-hud:size-5 size-7 object-contain" />
			<span className="compact-hud:text-base -translate-y-0.5 text-xl font-bold text-amber-100">
				{props.score}
			</span>
		</div>
	);
};
