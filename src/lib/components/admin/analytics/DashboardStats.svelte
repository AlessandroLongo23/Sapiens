<script>
	import { CreditCard, Clock, Users, BookOpen } from 'lucide-svelte';
	import { activeAnalyticsTab } from '$lib/stores/store.js';
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { studentsStore } from '$lib/stores/students.js';
	
	let cardsData = $derived.by(() => {
		return [
			{
				id: 'earnings',
				icon: CreditCard,
				label: 'total earnings',
				value: statsStore.totalEarnings + "€",
				mobileValue: `${statsStore.totalEarnings}€`,
				backgroundColor: 'bg-green-50',
				iconColor: 'text-green-600',
				borderColor: 'border-green-300',
			},
			{
				id: 'calendar',
				icon: Clock,
				label: 'hours taught',
				value: statsStore.totalTime.hours + "h\n" + statsStore.totalTime.minutes + "m",
				mobileValue: `${statsStore.totalTime.hours}h ${statsStore.totalTime.minutes}m`,
				backgroundColor: 'bg-yellow-50',
				iconColor: 'text-yellow-600',
				borderColor: 'border-yellow-300',
			},
			{
				id: 'students',
				icon: Users,
				label: 'students',
				value: $studentsStore.students.length,
				backgroundColor: 'bg-blue-50',
				iconColor: 'text-blue-600',
				borderColor: 'border-blue-300',
			},
			{
				id: 'subjects',
				icon: BookOpen,
				label: 'subjects',
				value: $subjectsStore.subjects.length,
				backgroundColor: 'bg-purple-50',
				iconColor: 'text-purple-600',
				borderColor: 'border-purple-300',
			},
		]
	})
</script>

<div class="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
	{#each cardsData as card, index}
		<div 
			class="bg-white border-2 {card.id === $activeAnalyticsTab ? `${card.borderColor}` : 'border-zinc-200'} dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow p-4 sm:p-6 cursor-pointer" 
			onclick={() => { $activeAnalyticsTab = card.id; }}
			onkeydown={() => {}}
			role="button"
			tabindex="0"
		>
			<div class="flex flex-col sm:flex-row justify-between h-full">	
				<div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 {card.backgroundColor} rounded-lg flex items-center justify-center mb-3 sm:mb-0">
					<card.icon class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 {card.iconColor}" />
				</div>
				<div class="flex flex-col sm:items-end w-full sm:w-auto">
					<span class="text-xs font-medium text-[#6B7280] dark:text-[#A0A0A0] uppercase tracking-wide mb-1">{card.label}</span>
					<div class="flex items-baseline">
						{#if card.mobileValue && (index === 2 || index === 3)}
							<span class="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] dark:text-white block sm:hidden">{card.mobileValue}</span>
							<span class="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">{card.value}</span>
						{:else}
							<span class="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">{card.value}</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>