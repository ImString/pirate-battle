import { useState } from 'react';

import { MainMenuPage } from './pages/main';

type Screen = 'MainMenu';

const App: React.FC<{}> = () => {
	const [screen, setScreen] = useState<Screen>('MainMenu');

	return (
		<div className="bg-ocean-dark relative h-screen w-screen overflow-hidden select-none">
			{screen === 'MainMenu' && <MainMenuPage />}
		</div>
	);
};

export default App;
