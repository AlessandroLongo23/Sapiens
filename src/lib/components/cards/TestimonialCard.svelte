<script>
    import { levels } from '$lib/models/students.svelte.js';
	import * as ls from 'lucide-svelte';
	
	let { review, student } = $props();
	
	const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);
</script>

<div class="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] dark:hover:shadow-[0_24px_48px_rgba(0,0,0,0.6)] transition-all duration-700 border border-zinc-100/60 dark:border-zinc-800 hover:border-zinc-200/80 dark:hover:border-zinc-700">
    <div class="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-orange-50/10 dark:from-amber-500/5 dark:to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
	
    <div class="relative flex items-center mb-6 space-x-1">
		{#each stars as filled}
			<div class="relative">
				<ls.Star 
                    class="w-5 h-5 {filled ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-600'} transition-all duration-300 group-hover:scale-110" 
					style="transition-delay: {stars.indexOf(filled) * 50}ms"
				/>
			</div>
		{/each}
	</div>
	
    <blockquote class="relative text-zinc-700 dark:text-zinc-200 leading-relaxed mb-8 text-lg group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors duration-300">
        <ls.Quote class="absolute -top-2 -left-2 size-12 text-amber-500/20 dark:text-amber-400/15 group-hover:text-amber-500/25 dark:group-hover:text-amber-400/25 transition-colors duration-300 pointer-events-none" />
		<span class="relative italic font-medium">
			{review.review}
		</span>
	</blockquote>
	
	<div class="relative flex items-center">
        <div class="relative mr-4">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
				<span class="group-hover:scale-110 transition-transform duration-300">
					{student.avatar || student.first_name.charAt(0).toUpperCase()}
				</span>
			</div>
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 scale-110"></div>
		</div>
		
        <div class="relative">
            <div class="font-semibold text-zinc-800 dark:text-zinc-100 text-lg group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-300">
				{student.first_name} {student.last_name.charAt(0).toUpperCase()}.
			</div>
            <div class="text-zinc-500 dark:text-zinc-400 text-sm font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
				{levels.find(level => level.value === student.level)?.label || 'N/A'}
			</div>
		</div>
	</div>
	
    <div class="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-200 dark:via-amber-300/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</div> 