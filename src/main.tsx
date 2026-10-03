import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App.tsx';
import { OrientationGuard } from './components/layout/OrientationGuard';
import './styles/components.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<OrientationGuard>
			<App />
		</OrientationGuard>
	</StrictMode>
);
