<script>
    import { themeStore } from '$lib/components/shared/ui/theme/theme.ts';
    import { onMount } from 'svelte';
    
    let { children } = $props();

    onMount(() => {
        const storedTheme = localStorage.getItem('theme') || 'light';
        themeStore.setTheme(storedTheme);

        return themeStore.subscribe(theme => {
            localStorage.setItem('theme', theme);
        });
    });

    $effect(() => {
        if (typeof window === 'undefined') 
            return;
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        return () => {
            mediaQuery.removeEventListener('change', handler);
        };
    });
</script>

{@render children()}