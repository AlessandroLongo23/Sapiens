<script>
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { ChevronDown } from 'lucide-svelte';

	import Latex from '$lib/components/ui/Latex.svelte';
	
	let { sections = [], activeSection = '' } = $props();
	
	let expandedSections = $state({});
	
	$effect(() => {
		if (sections.length > 0 && Object.keys(expandedSections).length === 0) {
			const initialState = {};
			sections.forEach(section => {
				initialState[section.id] = true;
				
				if (section.subsections) {
					section.subsections.forEach(subsection => {
						if (subsection.id) {
							initialState[subsection.id] = true;
						}
					});
				}
			});
			expandedSections = initialState;
		}
	});
	
	const dispatch = createEventDispatcher();
	
	function scrollToSection(sectionId) {
		dispatch('sectionSelect', { sectionId });
	}
	
	function toggleSection(sectionId, event) {
		event.stopPropagation();
		expandedSections[sectionId] = !expandedSections[sectionId];
	}
	
	function hasSubsections(section) {
		return section.subsections && section.subsections.length > 0;
	}
	
	function isH1(section) {
		return section.level === 1;
	}
</script>

<div class="h-full flex flex-col w-full">
	<div class="flex-1 overflow-y-auto p-6 no-scrollbar">
		<div>
			{#each sections as section}
				<div class="mb-3">
					<div class="flex items-center">
						<button 
							class="text-left flex-1 py-1 rounded text-sm transition-colors
								{isH1(section) ? 'font-semibold' : 'font-medium'} 
								{activeSection === section.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}"
							onclick={() => scrollToSection(section.id)}
						>
							<Latex content={section.title} />
						</button>
						
						{#if hasSubsections(section)}
							<button 
								class="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
								onclick={(e) => toggleSection(section.id, e)}
								aria-label={expandedSections[section.id] ? "Collapse section" : "Expand section"}
								title={expandedSections[section.id] ? "Collapse section" : "Expand section"}
							>
								<ChevronDown 
									size={14} 
									class="transition-transform duration-200 {expandedSections[section.id] ? 'rotate-180' : ''}"
								/>
							</button>
						{/if}
					</div>
					
					{#if hasSubsections(section) && expandedSections[section.id]}
						<div class="ml-3 border-l border-zinc-500/25 pl-2 mt-1" transition:slide={{ duration: 150 }}>
							{#each section.subsections as subsection}
								<div class="my-1.5">
									<div class="flex items-center">
										<button 
											class="text-left flex-1 py-0.5 rounded text-xs font-medium transition-colors
												{activeSection === subsection.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}"
											onclick={() => scrollToSection(subsection.id)}
										>
											<Latex content={subsection.title} />
										</button>
										
										{#if hasSubsections(subsection)}
											<button 
												class="p-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
												onclick={(e) => toggleSection(subsection.id, e)}
												aria-label={expandedSections[subsection.id] ? "Collapse section" : "Expand section"}
												title={expandedSections[subsection.id] ? "Collapse section" : "Expand section"}
											>
												<ChevronDown 
													size={12} 
													class="transition-transform duration-200 {expandedSections[subsection.id] ? 'rotate-180' : ''}"
												/>
											</button>
										{/if}
									</div>
									
									{#if hasSubsections(subsection) && expandedSections[subsection.id]}
										<div class="ml-2 border-l border-zinc-500/25 pl-2 mt-1" transition:slide={{ duration: 150 }}>
											{#each subsection.subsections as subsubsection}
												<button 
													class="text-left w-full py-0.5 rounded text-xs transition-colors
														{activeSection === subsubsection.id ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'}"
													onclick={() => scrollToSection(subsubsection.id)}
												>
													<Latex content={subsubsection.title} />
												</button>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	button {
		outline: none;
	}
</style>