<script>
	import { studentsStore } from '$lib/stores/students/students.js';
	import { subjectsStore } from '$lib/stores/subjects/subjects.js';
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { widgetStyle } from '$lib/stores/appearance.js';
	import * as ls from 'lucide-svelte';

	import EarningsGraph from '$lib/components/graphs/EarningsGraph.svelte';

	let filterOptions = $state([
		{ id: 'all', name: 'All' },
		{ id: 'student', name: 'By Student' },
		{ id: 'subject', name: 'By Subject' }
	]);
	
	let timeRangeOptions = $state([
		{ id: 3, name: '3 Months' },
		{ id: 6, name: '6 Months' },
		{ id: 12, name: '12 Months' },
		{ id: 24, name: '24 Months' },
	]);
	
	function handleFilterChange(type, id = null) {
		statsStore.setFilter(type, id);
	}
	
	function handleTimeRangeChange(months) {
		statsStore.setTimeRange(months);
	}
	
	let totalEarnings = $derived.by(() => {
		if (!statsStore.earningsByMonth?.length) return 0;
		return statsStore.earningsByMonth.reduce((sum, item) => sum + item.earnings, 0);
	});
</script>

<div class="flex flex-col h-full transition-all duration-500 ease-in-out {widgetStyle}">
	<div class="p-4 border-b border-zinc-200 dark:border-zinc-800">
		<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Guadagni nel tempo</h2>
		
		<div class="mt-2 flex flex-wrap items-center justify-between gap-2">
			<div class="flex flex-wrap items-center gap-2">
				<div class="flex rounded overflow-hidden">
					{#each filterOptions as option}
						<button 
							class="
								px-3 py-1 text-sm border-r last:border-r-0 border-zinc-200 dark:border-zinc-700 transition
								{statsStore.filterType === option.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}
							"
							onclick={() => handleFilterChange(option.id)}
						>
							{option.name}
						</button>
					{/each}
				</div>
				
				{#if statsStore.filterType === 'student'}
					<select 
						class="px-3 py-1 text-sm border border-zinc-200 rounded dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
						bind:value={statsStore.filterId}
						onchange={() => handleFilterChange('student', statsStore.filterId)}
					>
						<option value={null}>All Students</option>
						{#each $studentsStore.students as student}
							<option value={student.id}>{student.name} {student.last_name}</option>
						{/each}
					</select>
				{:else if statsStore.filterType === 'subject'}
					<select 
						class="px-3 py-1 text-sm border border-zinc-200 rounded dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
						bind:value={statsStore.filterId}
						onchange={() => handleFilterChange('subject', statsStore.filterId)}
					>
						<option value={null}>All Subjects</option>
						{#each $subjectsStore.subjects as subject}
							<option value={subject.id}>{subject.name}</option>
						{/each}
					</select>
				{/if}
			</div>
			
			<div class="flex rounded overflow-hidden">
				{#each timeRangeOptions as option}
					<button 
						class="
							px-3 py-1 text-sm border-r last:border-r-0 border-zinc-200 dark:border-zinc-700 transition
							{statsStore.timeRange === option.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}
						"
						onclick={() => handleTimeRangeChange(option.id)}
					>
						{option.name}
					</button>
				{/each}
			</div>
		</div>
	</div>
	
	<div class="p-4 h-64">
		<EarningsGraph 
			filterOptions={filterOptions}
			timeRangeOptions={timeRangeOptions}
		/>
	</div>
	
	<div class="flex items-center gap-2 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
		<span class="text-sm text-zinc-500 dark:text-zinc-400">Total earnings:</span>
		<span class="text-sm font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(totalEarnings)}</span>
	</div>
</div> 