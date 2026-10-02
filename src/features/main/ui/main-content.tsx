import { WoodButton } from '@/shared/ui';

export const MainContent: React.FC<{}> = () => {
	return (
		<div className="mb-6 flex w-full flex-col items-center gap-3">
			<WoodButton variant="primary">Play</WoodButton>
			<WoodButton variant="primary">Options</WoodButton>
		</div>
	);
};
