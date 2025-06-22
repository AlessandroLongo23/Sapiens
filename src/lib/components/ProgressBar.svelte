<script>
	let { currentStep = 1, totalSteps = 4 } = $props();
	
	const steps = [
		{ number: 1, title: "Livello", description: "Scegli il tuo livello di studio" },
		{ number: 2, title: "Materie", description: "Seleziona le materie di interesse" },
		{ number: 3, title: "Frequenza", description: "Scegli la frequenza delle lezioni" },
		{ number: 4, title: "Contatti", description: "I tuoi dati per essere contattato" }
	];
</script>

<div class="mb-8 mx-8">
	<div class="relative">
		<div class="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 rounded-full"></div>
		
		<div 
			class="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
			style="width: {((currentStep - 1) / (totalSteps - 1)) * 100}%"
		></div>
		
		<div class="relative flex justify-between">
			{#each steps as step}
				<div class="flex flex-col items-center group">
					<div class="relative">
						<div 
							class="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 {
								step.number < currentStep 
									? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg scale-110' 
									: step.number === currentStep 
										? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg scale-110 animate-pulse' 
										: 'bg-white border-2 border-slate-200 text-slate-400'
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
							step.number <= currentStep ? 'text-slate-800' : 'text-slate-400'
						} transition-colors duration-300">
							{step.title}
						</div>
						<!-- <div class="text-xs {
							step.number <= currentStep ? 'text-slate-600' : 'text-slate-400'
						} mt-1 leading-tight transition-colors duration-300">
							{step.description}
						</div> -->
					</div>
				</div>
			{/each}
		</div>
	</div>
</div> 