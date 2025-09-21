<script>
	import { studentsStore } from '$lib/stores/students.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { formatCurrency } from '$lib/utils/format.svelte.js';
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { widgetStyle, designSystem } from '$lib/const/appearance.js';
	import * as ls from 'lucide-svelte';

	import EarningsGraph from '$lib/components/graphs/EarningsGraph.svelte';
	import StackedAreaChart from '$lib/components/graphs/StackedAreaChart.svelte';

	let filterOptions = $state([
		{ id: 'all', name: 'All' },
		{ id: 'student', name: 'By Student' },
		{ id: 'subject', name: 'By Subject' }
	]);
	
	let timeRangeOptions = $state([
		{ id: 3, name: '3M' },
		{ id: 6, name: '6M' },
		{ id: 12, name: '1Y' },
		{ id: 24, name: '2Y' },
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

<div class="flex flex-col h-full bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow">
	<div class="px-5 py-4 sm:p-6 border-b border-[#E5E7EB] dark:border-[#2A2A2A] flex items-center">
		<div class="p-2.5 mr-4 rounded-md bg-[#F0FDF4] dark:bg-[#1E1E1E]">
			<ls.LineChart class="w-5 h-5 text-[#22C55E]" />
		</div>
		<div class="flex-1">
			<h2 class="text-base font-semibold text-[#111827] dark:text-white leading-tight">Earnings over time</h2>
			<p class="text-xs sm:text-sm text-[#6B7280] dark:text-[#A0A0A0] mt-0.5">{formatCurrency(totalEarnings)} total</p>
		</div>
		
		<div class="flex items-center">
			<div class="flex rounded-md border border-[#E5E7EB] dark:border-[#333333] overflow-hidden">
				{#each timeRangeOptions as option}
					<button 
						class="
							px-3 py-1.5 text-xs font-medium transition-colors
							{statsStore.timeRange === option.id ? 'bg-[#22C55E]/10 text-[#15803D] dark:bg-[#22C55E]/10 dark:text-[#22C55E]' : 'bg-white dark:bg-[#121212] text-[#6B7280] dark:text-[#A0A0A0] hover:bg-[#F9FAFB] dark:hover:bg-[#1E1E1E]'}
						"
						onclick={() => handleTimeRangeChange(option.id)}
					>
						<span class="sm:hidden">{option.id === 24 ? '2y' : `${option.id}m`}</span>
						<span class="hidden sm:inline">{option.name}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
	
	<div class="p-5 border-b border-[#E5E7EB] dark:border-[#2A2A2A] flex flex-wrap items-center gap-3">
		<div class="flex rounded-md border border-[#E5E7EB] dark:border-[#333333] overflow-hidden">
			{#each filterOptions as option}
				<button 
					class="
						px-3 py-1.5 text-xs font-medium transition-colors
						{statsStore.filterType === option.id ? 'bg-[#22C55E]/10 text-[#15803D] dark:bg-[#22C55E]/10 dark:text-[#22C55E]' : 'bg-white dark:bg-[#121212] text-[#6B7280] dark:text-[#A0A0A0] hover:bg-[#F9FAFB] dark:hover:bg-[#1E1E1E]'}
					"
					onclick={() => handleFilterChange(option.id)}
				>
					{option.name}
				</button>
			{/each}
		</div>
		
		{#if statsStore.filterType === 'student'}
			<select 
				class="px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E7EB] rounded-md dark:border-[#333333] dark:bg-[#1E1E1E] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E]"
				bind:value={statsStore.filterId}
				onchange={() => handleFilterChange('student', statsStore.filterId)}
			>
				<option value={null}>All Students</option>
				{#each $studentsStore.students as student}
					<option value={student.id}>{student.first_name} {student.last_name}</option>
				{/each}
			</select>
		{:else if statsStore.filterType === 'subject'}
			<select 
				class="px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E7EB] rounded-md dark:border-[#333333] dark:bg-[#1E1E1E] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E]"
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
	
	<div class="p-6 h-72 flex-1">
		<EarningsGraph 
			filterOptions={filterOptions}
			timeRangeOptions={timeRangeOptions}
		/>
	</div>
</div> 