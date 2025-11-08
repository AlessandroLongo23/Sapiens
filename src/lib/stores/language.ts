import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { setLocale, getLocale, locales } from '$lib/paraglide/runtime.js';
import type { Locale } from '$lib/paraglide/runtime.js';

const fallbackLocale = (locales.includes('it') ? 'it' : locales[0]) as Locale;

function resolveInitialLocale(): Locale {
    if (!browser) {
        return fallbackLocale;
    }

    const stored = localStorage.getItem('language');
    if (stored && locales.includes(stored as Locale)) {
        return stored as Locale;
    }

    try {
        return getLocale();
    } catch (error) {
        console.warn('Fallback to default locale because getLocale failed', error);
        return fallbackLocale;
    }
}

function createLanguageStore() {
    const initialLocale = resolveInitialLocale();
    const { subscribe, set } = writable<Locale>(initialLocale);

    if (browser) {
        // Ensure Paraglide runtime matches the store without reloading the page
        setLocale(initialLocale, { reload: false });
    }

    return {
        subscribe,
        setLanguage: (language: Locale) => {
            if (!locales.includes(language)) {
                return;
            }

            if (browser) {
                localStorage.setItem('language', language);
                setLocale(language, { reload: false });
            }

            set(language);
        }
    };
}

export const languageStore = createLanguageStore();