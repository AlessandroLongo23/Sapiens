import { writable } from 'svelte/store';

function createThemeStore() {
    const { subscribe, set } = writable('light');

    return {
        subscribe,
        /**
         * Apply a theme. Only an explicit choice (the toggle) is persisted, so a
         * visitor who never touched the toggle keeps following the OS setting.
         */
        setTheme: (theme: string, explicit = false) => {
            document.documentElement.classList.add('disable-transitions');
            document.documentElement.classList.toggle('dark', theme === 'dark');
            if (explicit) {
                localStorage.setItem('theme', theme);
                localStorage.setItem('theme-explicit', '1');
            }
            set(theme);

            setTimeout(() => {
                document.documentElement.classList.remove('disable-transitions');
            }, 100);
        }
    };
}

export const themeStore = createThemeStore();
