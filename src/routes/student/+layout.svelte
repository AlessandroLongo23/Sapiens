<script>
	import { studentsStore } from '$lib/stores/students.js';
	import { motivational_messages } from '$lib/const/microcopy.js';
	import { selectedTopic } from '$lib/stores/content.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';
	
	import TopicCard from '$lib/components/cards/TopicCard.svelte';
	import ThemeToggle from '$lib/components/shared/ui/theme/ThemeToggle.svelte';

	let { data, children } = $props();
	let { user } = $derived(data);

	let isLoggingOut = $state(false);

	let student = $derived($studentsStore.students.find(student => student.id === user.id));

	let current_page = $derived.by(() => {
		if ($page.url.pathname.startsWith('/student/calendario'))
			return 'calendario';

		if ($page.url.pathname.startsWith('/student/materiale'))
			return 'materiale';

		if ($page.url.pathname.startsWith('/student/esercizi'))
			return 'esercizi';

		if ($page.url.pathname.startsWith('/student/profilo'))
			return 'profilo';

		if ($page.url.pathname.startsWith('/student/teoria'))
			return 'teoria';

		return 'calendario';
	})

	let motivational_message = $state(null);
	onMount(() => {
		motivational_message = $motivational_messages[Math.floor(Math.random() * $motivational_messages.length)];
	})
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-sans">
	<header class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
		{#if current_page === 'calendario' || current_page === 'materiale'}
			<div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
				<h1 class="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white">Ciao {student?.first_name}!</h1>
				<span class="hidden sm:inline text-zinc-700 dark:text-zinc-300 text-sm sm:text-xl">{motivational_message}</span>
			</div>
		{:else}
			<h1 class="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white truncate max-w-[180px] sm:max-w-none">{$selectedTopic.title}</h1>
		{/if}
		<div class="flex items-center gap-2 sm:gap-4">
			<ThemeToggle />

			<button
				onclick={() => goto(current_page === 'calendario' ? '/student/materiale' : '/student/calendario')}
				class="bg-zinc-50 dark:bg-zinc-800 border hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 text-zinc-700 px-2 sm:px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer transition-all duration-100 ease-in-out"
			>
				<span class="flex items-center justify-center sm:space-x-2">
					{#if current_page === 'calendario'}
						<ls.BookOpen class="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
					{:else}
						<ls.Calendar class="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
					{/if}
					<span class="hidden sm:inline text-zinc-700 dark:text-zinc-300">{current_page === 'calendario' ? 'Materiale' : 'Calendario'}</span>
				</span>
			</button>

			<form
				action="/auth/logout"
				method="POST"
			>
				<!-- <button
					type="submit"
					class="bg-zinc-50 dark:bg-zinc-800 border hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 text-red-500 dark:text-red-400 px-2 sm:px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer transition-all duration-100 ease-in-out"
					disabled={isLoggingOut}
				>
					<span class="flex items-center justify-center sm:space-x-2">
						<ls.LogOut class="w-4 h-4" />
						<span class="hidden sm:inline">{isLoggingOut ? 'Uscendo...' : 'Logout'}</span>
					</span>
				</button> -->
				<button
					type="submit"
					onclick={() => { isLoggingOut = true }}
					disabled={isLoggingOut}
					class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
				>
					<span class="flex items-center justify-center gap-2">
						<span>{isLoggingOut ? 'Uscendo...' : 'Logout'}</span>
						{#if isLoggingOut}
							<ls.Loader2 class="w-4 h-4 animate-spin" />
						{:else}
							<ls.LogOut class="w-4 h-4" />
						{/if}
					</span>
				</button>
			</form>
		</div>
	</header>

	<div class="relative mt-18 min-h-[calc(100vh-4.5rem)]">
		{@render children()}
	</div>
</div>