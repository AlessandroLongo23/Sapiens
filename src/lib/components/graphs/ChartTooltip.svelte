<script>
    import { designSystem } from '$lib/const/appearance.js';
    
    let { 
        visible,
        x,
        y,
        position,
        children
    } = $props();

    let tooltipStyles = $derived.by(() => {
        let translate = '';
        let style = '';
        let indicator = '';
        let offset = 12;

        if (position === 'top') {
            translate = '-translate-x-1/2';
            style = `left: ${x}px; top: ${y - offset}px;`;
            indicator = 'left-1/2 bottom-0 translate-y-1.5 -translate-x-1.5 rotate-45';
        } else if (position === 'bottom') {
            translate = '-translate-x-1/2 translate-y-full';
            style = `left: ${x}px; top: ${y + offset}px;`;
            indicator = 'left-1/2 top-0 -translate-y-1.5 -translate-x-1.5 -rotate-[135deg]';
        } else if (position === 'left') {
            translate = 'left-0 top-1/2 translate-y-1/2 -translate-x-full';
            style = `left: ${x - offset}px; top: ${y}px;`;
            indicator = 'right-0 top-1/2 -translate-y-1.5 translate-x-1.5 -rotate-45';
        } else if (position === 'right') {
            translate = 'left-0 top-1/2 translate-y-1/2 translate-x-1.5';
            style = `left: ${x + offset}px; top: ${y}px;`;
            indicator = 'left-0 top-1/2 -translate-y-1.5 -translate-x-1.5 rotate-[135deg]';
        }

        return {
            translate,
            style,
            indicator
        };
    });
</script>

{#if visible}
    <div 
        class="{tooltipStyles.translate} absolute flex flex-col z-50 bg-white dark:bg-[#121212] min-w-52 border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-lg shadow-md dark:shadow-glow transform transition-all duration-100 pointer-events-none"
        style={tooltipStyles.style}
    >
        {@render children()}

        <div class="{tooltipStyles.indicator} absolute size-3 bg-white dark:bg-[#121212] border-b border-r border-[#E5E7EB] dark:border-[#2A2A2A] transform"></div>
    </div>
{/if}