import { writable } from 'svelte/store';

function createThemeStore() {
    const { subscribe, set } = writable('light');

    return {
        subscribe,
        setTheme: (theme) => {
            document.documentElement.classList.add('disable-transitions');
            document.documentElement.classList.toggle('dark', theme === 'dark');
            localStorage.setItem('theme', theme);
            set(theme);
            
            setTimeout(() => {
                document.documentElement.classList.remove('disable-transitions');
            }, 100);
        }
    };
}

export const themeStore = createThemeStore();