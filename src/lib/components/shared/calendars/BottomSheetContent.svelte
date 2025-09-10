<script>
	import * as ls from 'lucide-svelte';
	
	let { 
		selectedDate = null, 
		selectedDayLectures = [], 
		handleLectureClick = () => {} 
	} = $props();
</script>

{#if selectedDayLectures.length > 0}
	<div class="space-y-3">
		{#each selectedDayLectures as lecture}
			<button 
				class="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer w-full text-left
					{lecture.status === 'pending' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-green-500'}"
				onclick={() => handleLectureClick(lecture)}
			>
				<div class="flex justify-between items-start">
					<div class="flex flex-col">
						<div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
							<ls.Clock size={14} />
							{lecture.start_time} - {lecture.end_time}
						</div>
						
						<div class="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2 mt-1">
							<ls.User size={14} />
							{lecture.student?.first_name} {lecture.student?.last_name}
						</div>
						
						<div class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
							<ls.BookOpen size={14} />
							{lecture.subject?.name || 'Materia non specificata'}
						</div>
					</div>
					
					{#if lecture.status === 'pending'}
						<span class="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-medium">
							In attesa
						</span>
					{:else}
						<span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
							Confermata
						</span>
					{/if}
				</div>
				
				{#if lecture.status === 'pending'}
					<div class="flex justify-end mt-3 gap-2">
						<span class="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:hover:bg-green-900 dark:text-green-400 transition cursor-pointer" title="Accetta lezione">
							<ls.Check size={14} />
						</span>
						<span class="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-400 transition cursor-pointer" title="Rifiuta lezione">
							<ls.X size={14} />
						</span>
					</div>
				{/if}
			</button>
		{/each}
	</div>
{:else}
	<div class="flex flex-col items-center justify-center py-8 text-center">
		<div class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
			<ls.Calendar class="text-zinc-400 dark:text-zinc-500" size={24} />
		</div>
		<h3 class="text-base font-medium text-zinc-900 dark:text-zinc-100">Nessuna lezione</h3>
		<p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Non ci sono lezioni programmate per questa data.</p>
	</div>
{/if}
