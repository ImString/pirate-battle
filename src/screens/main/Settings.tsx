import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Stepper } from '@/components/ui/Stepper';

import { GAME_CONFIG_LIMITS } from '@/game/config';
import { useStoreConfig } from '@/game/stores/Config';
import { useMatchStore } from '@/game/stores/Match';

import type { ScreenPage } from '@/types/global';

interface SettingsScreenProps {
	navigate: React.Dispatch<React.SetStateAction<ScreenPage>>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = props => {
	const config = useStoreConfig(state => state.config);
	const setConfig = useStoreConfig(state => state.setConfig);
	const configSaveFailed = useStoreConfig(state => state.configSaveFailed);
	const hasPausedMatch = useMatchStore(state => state.game?.state === 'paused');

	return (
		<Screen className="bg-[url(/assets/ui_scene_background.png)] bg-cover bg-center bg-no-repeat">
			<div className="pointer-events-none absolute inset-0 bg-black/25" />

			<Modal className="settings-panel compact-landscape:gap-[clamp(8px,2vh,20px)] mx-4 my-auto flex flex-col items-center justify-center gap-7">
				<h1 className="compact-landscape:text-[clamp(24px,6vh,36px)] text-4xl font-bold text-amber-200">
					OPTIONS
				</h1>
				<div className="compact-landscape:w-full compact-landscape:flex-row flex flex-col gap-6">
					<div className="flex w-full flex-col items-center gap-2">
						<Stepper
							label="Game session time"
							value={config.duration}
							min={GAME_CONFIG_LIMITS.duration.min}
							max={GAME_CONFIG_LIMITS.duration.max}
							step={GAME_CONFIG_LIMITS.duration.step}
							suffix="s"
							onValueChange={duration => setConfig({ duration })}
						/>
						<p className="text-center text-xs text-amber-100">
							{GAME_CONFIG_LIMITS.duration.min}–{GAME_CONFIG_LIMITS.duration.max} seconds
						</p>
					</div>
					<div className="flex w-full flex-col items-center gap-2">
						<Stepper
							label="Enemy spawn time"
							value={config.enemySpawnInterval}
							min={GAME_CONFIG_LIMITS.enemySpawnInterval.min}
							max={GAME_CONFIG_LIMITS.enemySpawnInterval.max}
							step={GAME_CONFIG_LIMITS.enemySpawnInterval.step}
							suffix="s"
							onValueChange={enemySpawnInterval => setConfig({ enemySpawnInterval })}
						/>
						<p className="text-center text-xs text-amber-100">
							{GAME_CONFIG_LIMITS.enemySpawnInterval.min}–{GAME_CONFIG_LIMITS.enemySpawnInterval.max}{' '}
							seconds
						</p>
					</div>
				</div>
				<p
					className="text-center text-sm font-semibold text-amber-100"
					role={configSaveFailed ? 'alert' : undefined}>
					{configSaveFailed
						? 'Changes apply to new games, but could not be saved in this browser.'
						: 'Changes are saved automatically and apply to new games.'}
				</p>
				<Button onClick={() => props.navigate(hasPausedMatch ? 'game' : 'menu')}>
					{hasPausedMatch ? 'Back to Game' : 'Main Menu'}
				</Button>
			</Modal>
		</Screen>
	);
};
