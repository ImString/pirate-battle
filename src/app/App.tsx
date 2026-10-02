import {
	MainMenuScreen,
	GameScreen,
	GameoverScreen,
	HistoryScreen,
	RankingScreen,
	SettingsScreen,
	PauseScreen
} from '@/screens';
import { useState } from 'react';

import type { ScreenPage } from '@/types/global';

const App: React.FC<{}> = () => {
	const [screen, setScreen] = useState<ScreenPage>('menu');

	switch (screen) {
		case 'menu':
			return <MainMenuScreen navigate={setScreen} />;
		case 'game':
			return <GameScreen navigate={setScreen} />;
		case 'gameover':
			return <GameoverScreen navigate={setScreen} />;
		case 'pause':
			return <PauseScreen navigate={setScreen} />;
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
