<script>
	import { contentService } from '$lib/services/contentService';
	import { createEventDispatcher, onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import * as ls from 'lucide-svelte';

	import TheorySidebar from '$lib/components/TheorySidebar.svelte';
	// import Checkbox from '$lib/components/ui/Checkbox.svelte';
	// import ShapeIcon from '$lib/components/ShapeIcon.svelte';
	// import Slider from '$lib/components/ui/Slider.svelte';
	// import Toggle from '$lib/components/ui/Toggle.svelte';
	// import Button from '$lib/components/ui/Button.svelte';
	// import Input from '$lib/components/ui/Input.svelte';
	// import Tabs from '$lib/components/ui/Tabs.svelte';

	let { 
		isSidebarOpen = $bindable(true),
		sidebarElement = $bindable(''),
		onSectionSelect = $bindable(() => {}),
		activeTheorySection = $bindable('')
	} = $props();

	let expandedGroups = $state({});
	
	$effect(() => {
		if (Object.keys(expandedGroups).length === 0) {
			let initialState = {};
			tilingRules.forEach(group => {
				initialState[group.title] = true;
			});
			expandedGroups = initialState;
		}
	});
	
	const toggleGroup = (groupTitle) => {
		expandedGroups[groupTitle] = !expandedGroups[groupTitle];
		setTimeout(setupObservers, 300);
	};

	const dispatch = createEventDispatcher();
	
	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen;
		
		dispatch('toggle', { isSidebarOpen });
		
		if (isSidebarOpen) {
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 300);
		}
	}

	const expandAll = () => {
		expandedGroups = tilingRules.reduce((acc, curr) => {
			acc[curr.title] = true;
			return acc;
		}, {});
		// We need to refresh observers after groups expand
		setTimeout(setupObservers, 300);
	}

	const collapseAll = () => {
		expandedGroups = tilingRules.reduce((acc, curr) => {
			acc[curr.title] = false;
			return acc;
		}, {});
		setTimeout(setupObservers, 300);
	}

	// Track current visible folder
	let catalogContainer;
	let currentVisibleGroup = $state("");
	let previousVisibleGroup = $state("");
	let scrollingTimer;
	let isScrolling = $state(false);
	let observer;
	let observerNeedsRefresh = $state(false);
	
	// Use $effect to replace afterUpdate
	$effect(() => {
		// If we just expanded or collapsed a group, we need to refresh the observers
		if (catalogContainer && observerNeedsRefresh) {
			const groupElements = catalogContainer.querySelectorAll('.tiling-group');
			if (groupElements.length > 0 && (!observer || observer.takeRecords().length === 0)) {
				setupObservers();
			}
			observerNeedsRefresh = false;
		}
	});
	
	// Function to setup or refresh IntersectionObserver
	const setupObservers = () => {
		if (!catalogContainer) return;
		
		// Clear previous observers
		if (observer) {
			observer.disconnect();
		}
		
		if (typeof IntersectionObserver !== 'undefined') {
			const options = {
				root: catalogContainer,
				rootMargin: '-10px 0px -90% 0px',
				threshold: 0
			};

			observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const groupTitle = entry.target.getAttribute('data-group-title');
						if (currentVisibleGroup !== groupTitle) {
							previousVisibleGroup = currentVisibleGroup;
							currentVisibleGroup = groupTitle;
						}
					}
				});
			}, options);
			
			// Observe all groups
			const groupElements = catalogContainer.querySelectorAll('.tiling-group');
			groupElements.forEach(element => {
				observer.observe(element);
			});
			
			// Mark that observers have been refreshed
			observerNeedsRefresh = false;
		}
	};
	
	// Setup IntersectionObserver for better scroll detection
	onMount(() => {
		setupObservers();
		
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
	
	// Handle traditional scroll detection as fallback
	const updateVisibleGroup = () => {
		// Only use this method if IntersectionObserver is not available
		if (observer) return;
		
		if (!catalogContainer) return;
		
		// Set scrolling state
		isScrolling = true;
		clearTimeout(scrollingTimer);
		scrollingTimer = setTimeout(() => {
			isScrolling = false;
		}, 100);
		
		const groupElements = catalogContainer.querySelectorAll('.tiling-group');
		
		for (let i = groupElements.length - 1; i >= 0; i--) {
			const element = groupElements[i];
			const rect = element.getBoundingClientRect();
			const containerRect = catalogContainer.getBoundingClientRect();
			
			// Check if element is visible
			if (rect.top <= containerRect.top + 50) {
				const groupTitle = element.getAttribute('data-group-title');
				if (currentVisibleGroup !== groupTitle) {
					previousVisibleGroup = currentVisibleGroup;
					currentVisibleGroup = groupTitle;
				}
				break;
			}
		}
	};
	
	// Track scrolling state for visual effects
	const handleScroll = () => {
		isScrolling = true;
		clearTimeout(scrollingTimer);
		scrollingTimer = setTimeout(() => {
			isScrolling = false;
		}, 100);
		
		// Fallback for browsers without IntersectionObserver
		if (!observer) {
			updateVisibleGroup();
		}
	};
	
	// Scroll to group when clicked from sticky header
	const scrollToGroup = (groupTitle) => {
		const groupElement = catalogContainer.querySelector(`.tiling-group[data-group-title="${groupTitle}"]`);
		if (groupElement) {
			groupElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};
	
	// Watch for changes that should trigger observer refresh
	$effect(() => {
		// Create a dependency on expandedGroups to refresh when it changes
		const expandedGroupsState = JSON.stringify(expandedGroups);
		if (Object.keys(expandedGroups).length > 0) {
			observerNeedsRefresh = true;
		}
	});

	// For theory content
	let theoryActiveSection = $state('');
	
	const handleTheorySectionSelect = (e) => {
		onSectionSelect(e.detail.sectionId);
	};

	$effect(() => {
		theoryActiveSection = activeTheorySection;
	});
</script>

<div id="sidebar" class="h-full fixed left-0 top-0 transition-all duration-300 flex flex-col shadow-2xl {isSidebarOpen ? 'w-96' : 'w-12'}" bind:this={sidebarElement}>
	<div class="bg-zinc-800/90 backdrop-blur-sm text-white h-full overflow-hidden flex flex-col border-r border-zinc-700/50">
		<div class="p-3 flex items-center justify-between border-b border-zinc-700/50 flex-shrink-0 bg-zinc-900/30">
			{#if isSidebarOpen}
				<h2 class="text-sm font-medium text-white/90 uppercase tracking-wider">Controls</h2>
			{/if}

			<button
				onclick={toggleSidebar}
				class="p-1 rounded-md hover:bg-zinc-700/70 transition-all text-white/80 hover:text-white/100"
				aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
			>
				{#if isSidebarOpen}
					<ls.ChevronLeft size={18} />
				{:else}
					<ls.ChevronRight size={18} />
				{/if}
			</button>
		</div>
		
		{#if isSidebarOpen}
			<div class="flex-1 overflow-hidden">
				<TheorySidebar 
					activeSection={theoryActiveSection}
					on:sectionSelect={handleTheorySectionSelect}
				/>
			</div>
		{/if}
	</div>
</div> 

<style>
	.sticky-header {
		position: sticky;
		top: 0;
		z-index: 10;
		transition: all 0.2s ease;
	}
	
	.sticky-header.scrolling {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	
	.group-indicator {
		padding: 0.25rem 0.5rem;
		margin-top: 0.5rem;
		background-color: rgba(39, 39, 42, 0.5);
		border-radius: 0.25rem;
		transition: all 0.15s ease;
		border: 1px solid rgba(63, 63, 70, 0.3);
	}
</style>