import { twMerge } from 'tailwind-merge';

interface ModalProps {
	children: React.ReactNode;
	className?: string;
}

export const Modal: React.FC<ModalProps> = props => {
	return (
		<div
			className={twMerge(
				'compact-landscape:aspect-auto compact-landscape:w-[min(760px,100%)] compact-landscape:border-x-[20px] compact-landscape:border-y-[22px] compact-landscape:p-[clamp(8px,2vh,20px)] relative aspect-4/5 max-h-full w-xl max-w-full shrink-0 touch-pan-y overflow-auto border-x-[30px] border-y-[38px] border-solid p-6 text-white',
				props.className
			)}
			style={{ borderImage: "url('/assets/png/default/ui/menu/panel_menu.png') 40 32 fill stretch" }}>
			{props.children}
		</div>
	);
};
