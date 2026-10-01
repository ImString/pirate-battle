import { useState } from 'react';

import { MainMenuPage } from './pages/MainMenu';

type Screen = 'MainMenu';

const App: React.FC<{}> = () => {
	const [screen, setScreen] = useState<Screen>('MainMenu');

	return (
		<div className="relative w-screen h-screen overflow-hidden font-sans select-none">
			{screen === 'MainMenu' && <MainMenuPage />}
		</div>
	);
};

export default App;
