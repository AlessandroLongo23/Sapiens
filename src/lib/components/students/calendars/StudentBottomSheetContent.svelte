<script>
	import * as ls from 'lucide-svelte';
	
	let { 
		selectedDate = null, 
		selectedDayLectures = [], 
		user = null, 
		isDayInFuture = () => false, 
		openScheduleModal = () => {} 
	} = $props();
</script>

{#if selectedDayLectures.length > 0}
	<div class="space-y-3">
		{#each selectedDayLectures as lecture}
			{@const isUserLecture = lecture.student_id === user.id}
			<div 
				class="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg
					{isUserLecture ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}"
			>
				<div class="flex justify-between items-start">
					<div class="flex flex-col">
						<div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
							<ls.Clock size={14} />
							{lecture.start_time} - {lecture.end_time}
						</div>
						
						{#if isUserLecture}
							<div class="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2 mt-1">
								<ls.BookOpen size={14} />
								{lecture.subject?.name || 'Materia non specificata'}
							</div>
						{:else}
							<div class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
								Occupato
							</div>
						{/if}
					</div>
					
					{#if isUserLecture}
						<span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
							La mia lezione
						</span>
					{:else}
						<span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
							Occupato
						</span>
					{/if}
				</div>
			</div>
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

{#if selectedDate && isDayInFuture(selectedDate)}
	<div class="mt-6 flex justify-center">
		<button 
			onclick={openScheduleModal}
			class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
		>
			<ls.Plus size={16} />
			Proponi lezione
		</button>
	</div>
{/if}
