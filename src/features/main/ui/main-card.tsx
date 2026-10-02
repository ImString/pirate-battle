import { WoodMenu } from '@/features/menu';
import { MainHeader } from './main-header';
import { MainContent } from './main-content';
import { MainFooter } from './main-footer';

interface MainCardProps {}

export const MainCard: React.FC<MainCardProps> = () => {
	return (
		<WoodMenu>
			<MainHeader />
			<MainContent />
			<MainFooter />
		</WoodMenu>
	);
};
