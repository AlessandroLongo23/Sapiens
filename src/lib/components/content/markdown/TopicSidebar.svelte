<script>
	import { createEventDispatcher, tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import { ChevronDown } from 'lucide-svelte';

	import Latex from '$lib/components/ui/Latex.svelte';

	/**
	 * The lesson's table of contents. `touch` renders the rows tall enough
	 * for a finger (in the phone sheet); the desktop column keeps them dense.
	 */
	let { sections = [], activeSection = '', touch = false } = $props();

	let expandedSections = $state({});
	let list = $state(null);

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

	// In the sheet, open on the section being read.
	$effect(() => {
		if (!touch || !activeSection || !list) return;
		tick().then(() => {
			list?.querySelector(`[data-section="${activeSection}"]`)?.scrollIntoView({ block: 'center' });
		});
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

	const rowClass = (active, level) => {
		const size = touch
			? level === 0 ? 'text-base min-h-[44px] px-2 rounded-xl' : level === 1 ? 'text-sm min-h-[40px] px-2 rounded-xl' : 'text-sm min-h-[36px] px-2 rounded-lg'
			: level === 0 ? 'text-sm py-1 rounded' : 'text-xs py-0.5 rounded';
		const color = active
			? touch ? 'text-crimson-700 dark:text-crimson-300 bg-crimson-50 dark:bg-crimson-900/20' : 'text-zinc-900 dark:text-zinc-100'
			: 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200' + (touch ? ' active:bg-zinc-100 dark:active:bg-zinc-800' : '');
		return `text-left flex-1 flex items-center transition-colors ${size} ${color}`;
	};

	const toggleClass = touch
		? 'flex size-[40px] items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-100 dark:active:bg-zinc-800'
		: 'p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300';
</script>

<div class="h-full flex flex-col w-full">
	<div bind:this={list} class="flex-1 overflow-y-auto {touch ? 'px-3 py-2' : 'p-6'} no-scrollbar">
		<div>
			{#each sections as section}
				<div class={touch ? 'mb-1' : 'mb-3'}>
					<div class="flex items-center">
						<button
							class="{rowClass(activeSection === section.id, 0)} {isH1(section) ? 'font-semibold' : 'font-medium'}"
							data-section={section.id}
							aria-current={activeSection === section.id ? 'location' : undefined}
							onclick={() => scrollToSection(section.id)}
						>
							<Latex content={section.title} />
						</button>

						{#if hasSubsections(section)}
							<button
								class={toggleClass}
								onclick={(e) => toggleSection(section.id, e)}
								aria-label={expandedSections[section.id] ? 'Chiudi la sezione' : 'Apri la sezione'}
								aria-expanded={!!expandedSections[section.id]}
							>
								<ChevronDown
									size={touch ? 18 : 14}
									class="transition-transform duration-200 {expandedSections[section.id] ? 'rotate-180' : ''}"
								/>
							</button>
						{/if}
					</div>

					{#if hasSubsections(section) && expandedSections[section.id]}
						<div class="ml-3 border-l border-zinc-500/25 pl-2 mt-1" transition:slide={{ duration: 150 }}>
							{#each section.subsections as subsection}
								<div class={touch ? 'my-0.5' : 'my-1.5'}>
									<div class="flex items-center">
										<button
											class="{rowClass(activeSection === subsection.id, 1)} font-medium"
											data-section={subsection.id}
											aria-current={activeSection === subsection.id ? 'location' : undefined}
											onclick={() => scrollToSection(subsection.id)}
										>
											<Latex content={subsection.title} />
										</button>

										{#if hasSubsections(subsection)}
											<button
												class={toggleClass}
												onclick={(e) => toggleSection(subsection.id, e)}
												aria-label={expandedSections[subsection.id] ? 'Chiudi la sezione' : 'Apri la sezione'}
												aria-expanded={!!expandedSections[subsection.id]}
											>
												<ChevronDown
													size={touch ? 16 : 12}
													class="transition-transform duration-200 {expandedSections[subsection.id] ? 'rotate-180' : ''}"
												/>
											</button>
										{/if}
									</div>

									{#if hasSubsections(subsection) && expandedSections[subsection.id]}
										<div class="ml-2 border-l border-zinc-500/25 pl-2 mt-1" transition:slide={{ duration: 150 }}>
											{#each subsection.subsections as subsubsection}
												<button
													class="{rowClass(activeSection === subsubsection.id, 2)} w-full"
													data-section={subsubsection.id}
													aria-current={activeSection === subsubsection.id ? 'location' : undefined}
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
