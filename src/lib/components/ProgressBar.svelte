<script>
	import { steps } from '$lib/data.js';

	let { currentStep = 1, totalSteps = 4 } = $props();
</script>

<div class="mx-8">
    <div class="relative">
        <div class="absolute top-6 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
		
		{#if currentStep > 2}
			<div 
				class="absolute top-6 left-0 h-0.5 bg-green-500 rounded-full transition-all duration-700 ease-out z-10"
				style="width: {((currentStep - 2) / (totalSteps - 1)) * 100}%"
			></div>
		{/if}
		
		{#if currentStep > 1}
			<div 
				class="absolute top-6 left-0 h-0.5 bg-green-500 rounded-full transition-all duration-700 ease-out z-10"
				style="width: {((currentStep - 2) / (totalSteps - 1)) * 100}%"
			></div>
			<div 
				class="absolute top-6 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
				style="left: {((currentStep - 2) / (totalSteps - 1)) * 100}%; width: {(1 / (totalSteps - 1)) * 100}%"
			></div>
		{/if}
		
        <div class="relative flex justify-between z-20">
			{#each $steps as step}
				<div class="flex flex-col items-center group">
					<div class="relative">
						<div 
                            class="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 {
                                step.number < currentStep 
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg scale-110' 
                                    : step.number === currentStep 
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg scale-110 ' 
                                        : 'bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                            }"
						>
							{#if step.number < currentStep}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							{:else}
								<span>{step.number}</span>
							{/if}
						</div>
						
						{#if step.number === currentStep}
							<div class="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></div>
						{/if}
					</div>
					
                    <div class="mt-3 text-center max-w-20">
                        <div class="text-sm font-semibold {
                            step.number <= currentStep ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'
                        } transition-colors duration-300">
							{step.title}
						</div>
						<!-- <div class="text-xs {
							step.number <= currentStep ? 'text-zinc-600' : 'text-zinc-400'
						} mt-1 leading-tight transition-colors duration-300">
							{step.description}
						</div> -->
					</div>
				</div>
			{/each}
		</div>
	</div>
</div> 