<script lang="ts">
    import { themeStore } from '$lib/components/ui/theme/theme';
    import { onMount } from 'svelte';

    let { children } = $props();

    onMount(() => {
        const stored: string | null = localStorage.getItem('theme');
        const media: MediaQueryList | null = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
        const systemTheme = (): string => (media?.matches ? 'dark' : 'light');

        themeStore.setTheme(stored || systemTheme());

        // Follow the OS only while the user has not picked a theme explicitly.
        const followSystem = (event: MediaQueryListEvent): void => {
            if (!localStorage.getItem('theme-explicit')) {
                themeStore.setTheme(event.matches ? 'dark' : 'light');
            }
        };
        media?.addEventListener('change', followSystem);

        return () => media?.removeEventListener('change', followSystem);
    });
</script>

{@render children()}
