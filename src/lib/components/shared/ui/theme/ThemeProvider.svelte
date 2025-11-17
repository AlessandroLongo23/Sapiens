<script lang="ts">
    import { themeStore } from '$lib/components/shared/ui/theme/theme';
    import { onMount } from 'svelte';
    
    let { children } = $props();

    onMount(() => {
        const storedTheme: string = localStorage.getItem('theme') || 'light';
        themeStore.setTheme(storedTheme);

        return themeStore.subscribe(theme => {
            localStorage.setItem('theme', theme);
        });
    });

    $effect(() => {
        if (typeof window === 'undefined') 
            return;
        
        const mediaQuery: MediaQueryList = window.matchMedia('(prefers-color-scheme: light)');
        
        return () => {
            mediaQuery.removeEventListener('change', (event: MediaQueryListEvent): void => {
                if (event.matches) {
                    themeStore.setTheme('light');
                } else {
                    themeStore.setTheme('dark');
                }
            });
        };
    });
</script>

{@render children()}