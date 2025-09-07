<script>
	import * as ls from 'lucide-svelte';

	let { streak = 5, nextMilestone = 7 } = $props();
	
	
	let today = new Date();
	let currentMonth = today.getMonth();
	let currentYear = today.getFullYear();
	let firstDayOfMonth = new Date(currentYear, currentMonth, 1);
	let lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
	let daysInMonth = lastDayOfMonth.getDate();
	
	
	let firstDayOfWeek = firstDayOfMonth.getDay() || 7;
	let previousMonthDays = firstDayOfWeek - 1;
	
	let lastDayOfWeek = lastDayOfMonth.getDay() || 7;
	let nextMonthDays = 7 - lastDayOfWeek;
	
	let previousMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
	
	let dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
	
	
	function isActive(year, month, day) {
		return Math.random() > 0.5;
	}
</script>

<div class="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm p-6">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
			<div class="h-8 w-8 flex items-center justify-center bg-yellow-500 text-white rounded-lg">
				<ls.Flame class="h-5 w-5" />
			</div>
			<span>Streak</span>
		</h3>
		<div class="text-2xl font-bold text-yellow-500">{streak} giorni</div>
	</div>
	
	<div class="mb-4">
		<div class="flex justify-between text-sm mb-1">
			<span class="text-zinc-500 dark:text-zinc-400">Obiettivo</span>
			<span class="text-zinc-900 dark:text-white font-medium">{streak}/{nextMilestone} giorni</span>
		</div>
		<div class="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
			<div class="bg-yellow-500 h-2 rounded-full" style="width: {(streak/nextMilestone) * 100}%"></div>
		</div>
	</div>
	
	<div>
		<h4 class="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
			Calendario attività {today.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
		</h4>
		
		<div>
			<div class="grid grid-cols-7 gap-1 mb-1">
				{#each dayNames as day}
					<div class="w-6 h-6 flex items-center justify-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
						{day[0]}
					</div>
				{/each}
			</div>
			
			<div class="grid grid-cols-7 gap-1">
				
				{#each Array(previousMonthDays) as _, i}
					{@const prevDay = previousMonthLastDay - previousMonthDays + i + 1}
					<div 
						class="w-6 h-6 flex items-center justify-center rounded-sm bg-zinc-200 dark:bg-zinc-700 opacity-40 text-xs text-zinc-600 dark:text-zinc-400"
						title={new Date(currentYear, currentMonth - 1, prevDay).toLocaleDateString('it-IT', { weekday: 'short', month: 'short', day: 'numeric' })}
					>
						{prevDay}
					</div>
				{/each}
				
				
				{#each Array(daysInMonth) as _, i}
					{@const day = i + 1}
					{@const isToday = day === today.getDate()}
					{@const active = isActive(currentYear, currentMonth, day)}
					<div 
						class="w-6 h-6 flex items-center justify-center rounded-sm {active ? 'bg-yellow-500 dark:bg-yellow-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300'} 
						{isToday ? 'ring-2 ring-yellow-400' : ''} text-xs font-medium"
						title={new Date(currentYear, currentMonth, day).toLocaleDateString('it-IT', { weekday: 'short', month: 'short', day: 'numeric' })}
					>
						{day}
					</div>
				{/each}
				
				
				{#each Array(nextMonthDays) as _, i}
					{@const nextDay = i + 1}
					<div 
						class="w-6 h-6 flex items-center justify-center rounded-sm bg-zinc-200 dark:bg-zinc-700 opacity-40 text-xs text-zinc-600 dark:text-zinc-400"
						title={new Date(currentYear, currentMonth + 1, nextDay).toLocaleDateString('it-IT', { weekday: 'short', month: 'short', day: 'numeric' })}
					>
						{nextDay}
					</div>
				{/each}
			</div>
		</div>
		<div class="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center">
			Ultimo accesso: {new Date().toLocaleDateString('it-IT', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
		</div>
	</div>
</div>
