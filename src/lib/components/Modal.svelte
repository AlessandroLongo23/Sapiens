<script>
	import * as ls from 'lucide-svelte';
	
	let {
		isOpen = $bindable(false),
		title = '',
		children
	} = $props();

	function closeModal() {
		isOpen = false;
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function handleModalScroll(event) {
		event.stopPropagation();
	}

	function handleBackgroundScroll(event) {
		event.preventDefault();
		event.stopPropagation();
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 transition-all duration-500"
		onclick={closeModal}
		onkeydown={handleKeydown}
		onwheel={handleBackgroundScroll}
		ontouchmove={handleBackgroundScroll}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			role="dialog"
			tabindex="-1"
			onkeydown={() => {}}
			class="bg-white dark:bg-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md flex flex-col border border-zinc-100/60 dark:border-zinc-700/60 transform transition-all duration-500 scale-100"
			onclick={(e) => e.stopPropagation()}
			onwheel={handleModalScroll}
			ontouchmove={handleModalScroll}
		>
			<div class="flex justify-between items-center p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-700 flex-shrink-0">
				<h3
					class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent"
				>
					{title}
				</h3>
				<button
					onclick={closeModal}
					class="group p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors duration-300 cursor-pointer"
					aria-label="Chiudi modal"
				>
					<ls.X
						class="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-300"
					/>
				</button>
			</div>
			<div class="p-4 sm:p-8 flex-1">
				{@render children()}
			</div>
		</div>
	</div>
{/if} 