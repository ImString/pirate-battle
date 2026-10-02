import { twMerge } from 'tailwind-merge';

interface ModalProps {
	children: React.ReactNode;
	className?: string;
}

export const Modal: React.FC<ModalProps> = props => {
	return (
		<div
			className={twMerge(
				'relative aspect-4/5 w-xl max-w-[calc(100vw-2rem)] shrink-0 overflow-hidden p-8 text-white',
				props.className
			)}
			style={{
				borderStyle: 'solid',
				borderWidth: '38px 30px',
				borderImageSource: 'url(/assets/png/default/ui/menu/panel_menu.png)',
				borderImageSlice: '40 32 fill',
				borderImageRepeat: 'stretch'
			}}>
			{props.children}
		</div>
	);
};
