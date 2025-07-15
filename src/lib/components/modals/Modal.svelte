<script>
	import { fade, fly } from 'svelte/transition';
	
	let { 
		isOpen = $bindable(false),
		classes = '', 
		onClose = () => {}, 
		isInstantTransition = false,
		closeOnOutsideClick = true, 
		children, 
		backgroundBlur = 'none'
	} = $props();

	const handleBackdropClick = (e) => {
		if (closeOnOutsideClick && e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	let backgroundBlurClasses = {
		none: '',
		xs: 'backdrop-blur-xs',
		sm: 'backdrop-blur-sm',
		md: 'backdrop-blur-md',
		lg: 'backdrop-blur-lg',
		xl: 'backdrop-blur-xl'
	}

	function handleModalScroll(event) {
		event.stopPropagation();
	}

	function handleBackgroundScroll(event) {
		event.preventDefault();
		event.stopPropagation();
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 bg-black/25 {backgroundBlurClasses[backgroundBlur]} z-50"
		onclick={handleBackdropClick}
		onwheel={handleBackgroundScroll}
		ontouchmove={handleBackgroundScroll}
		onkeydown={handleKeydown}
		role="presentation"
		transition:fade|local={{ duration: isInstantTransition ? 0 : 100 }}
	>
		<div 
			class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full duration-200 {classes}"
			onwheel={handleModalScroll}	
			ontouchmove={handleModalScroll}
			transition:fly|local={{ duration: isInstantTransition ? 0 : 300, y: 15 }}
		>
			{@render children()}
		</div>
	</div>
{/if}