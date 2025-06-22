<script>
	import { Star, Quote } from 'lucide-svelte';
	let { name, comment, rating, subject, avatar } = $props();
	
	// Generate star display
	const stars = Array.from({ length: 5 }, (_, i) => i < rating);
</script>

<div class="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-700 border border-slate-100/60 hover:border-slate-200/80">
	<!-- Subtle gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-orange-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
	
	<!-- Quote icon -->
	<div class="relative mb-6">
		<div class="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 group-hover:from-amber-50 group-hover:to-orange-50 transition-all duration-500">
			<Quote class="w-6 h-6 text-amber-600/80 group-hover:text-amber-600 transition-colors duration-300" />
		</div>
	</div>
	
	<!-- Stars with elegant styling -->
	<div class="relative flex items-center mb-6 space-x-1">
		{#each stars as filled}
			<div class="relative">
				<Star 
					class="w-5 h-5 {filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} transition-all duration-300 group-hover:scale-110" 
					style="transition-delay: {stars.indexOf(filled) * 50}ms"
				/>
			</div>
		{/each}
	</div>
	
	<!-- Testimonial text with enhanced typography -->
	<blockquote class="relative text-slate-700 leading-relaxed mb-8 text-lg group-hover:text-slate-800 transition-colors duration-300">
		<span class="text-slate-600 text-6xl absolute -top-2 -left-1 opacity-20 font-serif leading-none">"</span>
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
			<div class="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors duration-300">
				{name}
			</div>
			<div class="text-slate-500 text-sm font-medium group-hover:text-slate-600 transition-colors duration-300">
				{subject}
			</div>
		</div>
	</div>
	
	<!-- Subtle bottom accent -->
	<div class="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</div> 