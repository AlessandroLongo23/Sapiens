'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/hooks/use-theme';

export function ThemeToggle() {
	const [theme, toggle] = useTheme();
	const dark = theme === 'dark';
	return (
		<button type="button" aria-label="Tema scuro" aria-pressed={dark} title={dark ? 'Passa al tema chiaro' : 'Passa al tema scuro'} onClick={toggle} className="relative flex items-center justify-center rounded-xl border border-edge bg-surface-2 p-2 hover:bg-surface-4 focus-ring-offset">
			<span className="relative flex size-5 items-center justify-center" aria-hidden="true">
				<Sun className="theme-toggle-icon absolute size-5 rotate-0 scale-100 text-fg-strong transition-all duration-200 dark:-rotate-90 dark:scale-0" />
				<Moon className="theme-toggle-icon absolute size-5 rotate-90 scale-0 text-fg-strong transition-all duration-200 dark:rotate-0 dark:scale-100" />
			</span>
		</button>
	);
}
