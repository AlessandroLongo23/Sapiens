<script>
	import * as ls from 'lucide-svelte';
	import { themeStore } from '$lib/components/shared/ui/theme/theme.js';

	const toggleTheme = () => {
		const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
		themeStore.setTheme(newTheme);
	}
</script>

<button 
	class="
		relative flex items-center justify-center p-2
		bg-zinc-50 dark:bg-zinc-800 border hover:bg-zinc-200 dark:hover:bg-zinc-700 
		border-zinc-200 dark:border-zinc-700
		rounded-xl transition-all duration-100 ease-in-out  cursor-pointer
	"
	onclick={toggleTheme}
>
	<div class="relative size-5 flex items-center justify-center">
		<ls.Sun class="absolute theme-toggle-icon size-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-zinc-950 dark:text-zinc-50" />
		<ls.Moon class="absolute theme-toggle-icon size-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-zinc-950 dark:text-zinc-50" />
	</div>
</button>