<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { themeStore } from '$lib/components/ui/theme/theme';

	const toggleTheme = (): void => {
		const newTheme: string = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
		themeStore.setTheme(newTheme);
	}
</script>

<button 
	class="
		relative flex items-center justify-center p-2
		bg-zinc-50 dark:bg-zinc-800 border hover:bg-zinc-200 dark:hover:bg-zinc-700 
		border-zinc-500/25
		rounded-xl cursor-pointer
	"
	onclick={toggleTheme}
>
	<div class="relative size-5 flex items-center justify-center cursor-pointer">
		<Sun class="theme-toggle-icon absolute size-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-zinc-950 dark:text-zinc-50 transition-all duration-200 ease-in-out" />
		<Moon class="theme-toggle-icon absolute size-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-zinc-950 dark:text-zinc-50 transition-all duration-200 ease-in-out" />
	</div>
</button>