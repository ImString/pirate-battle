import { useState } from 'react';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Stepper } from '@/components/ui/Stepper';

import type { ScreenPage } from '@/types/global';

interface SettingsScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = props => {
	const [gameSessionTime, setGameSessionTime] = useState(120);
	const [enemySpawnTime, setEnemySpawnTime] = useState(30);

	return (
		<Screen className="bg-[url(/assets/ui_scene_background.png)] bg-cover bg-center bg-no-repeat">
			<div className="pointer-events-none absolute inset-0 bg-black/25" />

			<Modal className="settings-panel compact-landscape:gap-[clamp(8px,2vh,20px)] mx-4 my-auto flex flex-col items-center justify-center gap-7">
				<h1 className="compact-landscape:text-[clamp(24px,6vh,36px)] text-4xl font-bold text-amber-200">
					OPTIONS
				</h1>
				<div className="compact-landscape:w-full compact-landscape:flex-row flex flex-col gap-6">
					<Stepper
						label="Game session time"
						value={gameSessionTime}
						min={30}
						max={300}
						step={15}
						suffix="s"
						onValueChange={setGameSessionTime}
					/>
					<Stepper
						label="Enemy spawn time"
						value={enemySpawnTime}
						min={5}
						max={120}
						step={5}
						suffix="s"
						onValueChange={setEnemySpawnTime}
					/>
				</div>
				<Button onClick={() => props.navigate('menu')}>Main Menu</Button>
			</Modal>
		</Screen>
	);
};
