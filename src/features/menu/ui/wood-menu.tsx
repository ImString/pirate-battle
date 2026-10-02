import { twMerge } from 'tailwind-merge';

interface WoodMenuProps {
	className?: string;
	children?: React.ReactNode;
}

export const WoodMenu: React.FC<WoodMenuProps> = props => {
	return (
		<div
			className={twMerge(
				`relative bg-[url(/assets/png/default/ui/menu/panel_menu.png)] bg-no-repeat p-8 text-white`,
				props.className
			)}>
			{props.children}
		</div>
	);
};
