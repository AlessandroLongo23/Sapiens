'use client';

import { useSyncExternalStore } from 'react';
import { Code, LayoutGrid, List, Monitor, Moon, PenLine, Sun } from 'lucide-react';
import { useThemePreference, type ThemePreference } from '@/lib/hooks/use-theme';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { SettingRow, SettingsGroup } from './Settings';

/**
 * A choice kept in this browser's localStorage under the same key its own
 * screen uses, so the two stay one setting. Other tabs hear of a change
 * through the `storage` event; this one through `listeners`.
 */
function useStored<T extends string>(key: string, values: readonly T[], fallback: T): [T, (value: T) => void] {
	const read = () => {
		try {
			const v = localStorage.getItem(key) as T | null;
			return v && values.includes(v) ? v : fallback;
		} catch {
			return fallback;
		}
	};
	const value = useSyncExternalStore(
		(l) => {
			listeners.add(l);
			window.addEventListener('storage', l);
			return () => {
				listeners.delete(l);
				window.removeEventListener('storage', l);
			};
		},
		read,
		() => fallback
	);
	const set = (next: T) => {
		try {
			localStorage.setItem(key, next);
		} catch {
			// Site data blocked: the choice is not remembered.
		}
		listeners.forEach((l) => l());
	};
	return [value, set];
}
const listeners = new Set<() => void>();

const THEMES: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
	{ value: 'light', label: 'Chiaro', icon: Sun },
	{ value: 'dark', label: 'Scuro', icon: Moon },
	{ value: 'system', label: 'Automatico', icon: Monitor }
];

export function AppearanceSettings() {
	const [theme, setTheme] = useThemePreference();
	return (
		<SettingsGroup title="Aspetto">
			<SettingRow label="Tema" hint="Automatico segue il tema chiaro o scuro scelto nelle impostazioni del dispositivo.">
				<ToggleGroup label="Tema" options={THEMES} value={theme} onChange={setTheme} />
			</SettingRow>
		</SettingsGroup>
	);
}

/** The keys are the Zaino's own (NoteEditor's `zaino:mode`, NoteList's `sapiens:zaino-vista`). */
export function ZainoSettings() {
	const [mode, setMode] = useStored('zaino:mode', ['simple', 'advanced'] as const, 'simple');
	const [view, setView] = useStored('sapiens:zaino-vista', ['griglia', 'elenco'] as const, 'griglia');
	return (
		<SettingsGroup title="Zaino">
			<SettingRow label="Modo di scrivere le note" hint="Semplice ha la barra degli strumenti, come un editor di testo; Avanzata è il markdown, per chi scrive ### e - a mano. Puoi sempre cambiarlo dentro una nota.">
				<ToggleGroup
					label="Modo di scrivere le note"
					options={[
						{ value: 'simple', label: 'Semplice', icon: PenLine },
						{ value: 'advanced', label: 'Avanzata', icon: Code }
					]}
					value={mode}
					onChange={setMode}
				/>
			</SettingRow>
			<SettingRow label="Le note di un quaderno" hint="Come appaiono le note quando apri un quaderno.">
				<ToggleGroup
					label="Vista delle note"
					options={[
						{ value: 'griglia', label: 'Griglia', icon: LayoutGrid },
						{ value: 'elenco', label: 'Elenco', icon: List }
					]}
					value={view}
					onChange={setView}
				/>
			</SettingRow>
		</SettingsGroup>
	);
}
