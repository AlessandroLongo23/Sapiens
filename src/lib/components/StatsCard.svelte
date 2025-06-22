<script>
	let { value, label, iconName } = $props();
	
	// Dynamic icon import
	import { Clock, BookOpen, Users } from 'lucide-svelte';
	
	const iconMap = {
		'clock': Clock,
		'book-open': BookOpen,
		'users': Users
	};
	
	const IconComponent = iconMap[iconName] || Clock;
</script>

<div class="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-700 border border-slate-100/60 hover:border-slate-200/80">
	<!-- Subtle gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
	
	<!-- Icon container with sophisticated gradient -->
	<div class="relative mb-6">
		<div class="inline-flex p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-500 shadow-sm">
			<div class="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-all duration-500">
				<IconComponent 
					class="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors duration-300 group-hover:scale-110 transform transition-transform duration-300" 
				/>
			</div>
		</div>
	</div>
	
	<!-- Value with enhanced typography -->
	<div class="relative text-4xl font-bold text-slate-800 mb-3 font-mono tracking-tight group-hover:text-slate-900 transition-colors duration-300">
		<span class="bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
			{value}
		</span>
	</div>
	
	<!-- Label with refined styling -->
	<div class="relative text-slate-600 font-medium text-lg group-hover:text-slate-700 transition-colors duration-300">
		{label}
	</div>
	
	<!-- Subtle hover effect line -->
	<div class="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</div> 