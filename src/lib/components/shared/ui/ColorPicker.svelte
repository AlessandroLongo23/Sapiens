<script>
    import { colors } from '$lib/stores/appearance.js';
    import { fade, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let { 
        selectedColor = colors[0].hex, 
        onColorSelect = () => {}
    } = $props();

    let isOpen = $state(false);

    const togglePicker = (e) => {
        e.stopPropagation();

        isOpen = !isOpen;
    }

    const selectColor = (hexColor) => {
        onColorSelect({ hex: hexColor });
        isOpen = false;
    }
</script>

<div class="relative flex flex-col items-center gap-2">
    <button 
        type="button"
        aria-label="colorpicker"
        onclick={(e) => togglePicker(e)}
        class="text-sm size-8 rounded-lg cursor-pointer"
        style="background-color: {selectedColor}"
    ></button>
    
    {#if isOpen}
        <div 
            class="absolute top-full right-0 mt-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow z-50 border border-zinc-500/25"
            transition:fade={{ duration: 200 }}
        >
            <div class="grid grid-cols-6 gap-2 w-60">
                {#each colors as color, i}
                    <button
                        type="button"
                        onclick={() => selectColor(color.hex)}
                        class="group relative size-8 rounded-lg cursor-pointer hover:scale-110 transition-transform"
                        style="background-color: {color.hex}"
                        transition:scale={{
                            duration: 200,
                            delay: i * 20,
                            easing: quintOut
                        }}
                    >
                        <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-800 text-zinc-50 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow shadow-zinc-950">
                            {color.name}
                        </span>
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div> 