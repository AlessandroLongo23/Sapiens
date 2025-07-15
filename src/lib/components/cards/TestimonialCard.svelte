<script>
	import { Star, Quote } from 'lucide-svelte';
	let { name, comment, rating, subject, avatar } = $props();
	
	// Generate star display
	const stars = Array.from({ length: 5 }, (_, i) => i < rating);
</script>

<div class="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-700 border border-zinc-100/60 hover:border-zinc-200/80">
	<!-- Subtle gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-orange-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
	
	<!-- Stars with elegant styling -->
	<div class="relative flex items-center mb-6 space-x-1">
		{#each stars as filled}
			<div class="relative">
				<Star 
					class="w-5 h-5 {filled ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'} transition-all duration-300 group-hover:scale-110" 
					style="transition-delay: {stars.indexOf(filled) * 50}ms"
				/>
			</div>
		{/each}
	</div>
	
	<!-- Testimonial text with enhanced typography -->
	<blockquote class="relative text-zinc-700 leading-relaxed mb-8 text-lg group-hover:text-zinc-800 transition-colors duration-300">
		<!-- Large background quote mark -->
		<Quote class="absolute -top-2 -left-2 size-12 text-amber-500/20 group-hover:text-amber-500/25 transition-colors duration-300 pointer-events-none" />
		<span class="relative italic font-medium">
			{comment}
		</span>
	</blockquote>
	
	<!-- Profile section with refined design -->
	<div class="relative flex items-center">
		<div class="relative mr-4">
			<!-- Avatar with sophisticated gradient -->
			<div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
				<span class="group-hover:scale-110 transition-transform duration-300">
					{avatar || name.charAt(0).toUpperCase()}
				</span>
			</div>
			<!-- Subtle ring effect -->
			<div class="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 scale-110"></div>
		</div>
		
		<div class="relative">
			<div class="font-semibold text-zinc-800 text-lg group-hover:text-zinc-900 transition-colors duration-300">
				{name}
			</div>
			<div class="text-zinc-500 text-sm font-medium group-hover:text-zinc-600 transition-colors duration-300">
				{subject}
			</div>
		</div>
	</div>
	
	<!-- Subtle bottom accent -->
	<div class="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</div> 