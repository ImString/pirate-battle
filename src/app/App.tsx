import { MainMenuScreen, GameScreen, HistoryScreen, RankingScreen, SettingsScreen } from '@/screens';
import { useEffect, useState } from 'react';

import { LoadingScreen } from '@/components/layout/LoadingScreen';

import type { ScreenPage } from '@/types/global';

import { useUiImagePreload } from './useUiImagePreload';

const App: React.FC = () => {
	const [screen, setScreen] = useState<ScreenPage>('menu');
	const { status, loaded, total, artworkReady, preload } = useUiImagePreload();

	useEffect(() => {
		void preload();
	}, [preload]);

	if (status !== 'ready') {
		return (
			<LoadingScreen
				artworkReady={artworkReady}
				progress={(loaded / total) * 100}
				title={status === 'error' ? 'Unable to load images' : undefined}
				description={status === 'error' ? 'Check your connection and try again.' : 'Preparing the interface.'}
				onRetry={status === 'error' ? () => void preload() : undefined}
			/>
		);
	}

	switch (screen) {
		case 'menu':
			return <MainMenuScreen navigate={setScreen} />;
		case 'game':
			return <GameScreen navigate={setScreen} />;
		case 'history':
			return <HistoryScreen navigate={setScreen} />;
		case 'ranking':
			return <RankingScreen navigate={setScreen} />;
		case 'settings':
			return <SettingsScreen navigate={setScreen} />;
		default:
			return <div>Unknown screen</div>;
	}
};

export default App;
