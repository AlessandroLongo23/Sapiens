<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let { 
        value = $bindable(null), 
        options = [], 
        placeholder = 'Select an option', 
        isNullable = false,
        disabled = false,
        searchable = true,
        maxHeight = 'max-h-36',
        classes = ''
    } = $props();

    let isOpen = $state(false);
    let searchQuery = $state('');
    let inputRef = $state(null);
    let selectRef = $state(null);
    let optionLabel = $derived(options.find(option => option.value === value)?.label || placeholder);
    let filteredOptions = $derived(
        searchable && searchQuery 
            ? options.filter(option => 
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : options
    );

    function handleOptionClick(option) {
        if (value === option.value && isNullable) {
            value = null;
        } else {
            value = option.value;
        }
        isOpen = false;
        searchQuery = '';
    }

    function handleKeydown(event) {
        if (!isOpen) {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
                event.preventDefault();
                isOpen = true;
                if (searchable) {
                    setTimeout(() => inputRef?.focus(), 50);
                }
            }
            return;
        }

        if (event.key === 'Escape') {
            isOpen = false;
            searchQuery = '';
        }
    }

    function handleSearchKeydown(event) {
        if (event.key === 'Enter' && filteredOptions.length > 0) {
            handleOptionClick(filteredOptions[0]);
        } else if (event.key === 'Escape') {
            isOpen = false;
            searchQuery = '';
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const buttons = document.querySelectorAll('[data-option-button]');
            if (buttons.length > 0) buttons[0].focus();
        }
    }

    function handleOptionKeydown(event, option, index) {
        if (event.key === 'Enter') {
            handleOptionClick(option);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const buttons = document.querySelectorAll('[data-option-button]');
            if (index < buttons.length - 1) buttons[index + 1].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const buttons = document.querySelectorAll('[data-option-button]');
            if (index > 0) {
                buttons[index - 1].focus();
            } else {
                inputRef?.focus();
            }
        }
    }

    function handleClickOutside(event) {
        if (selectRef && !selectRef.contains(event.target)) {
            isOpen = false;
            searchQuery = '';
        }
    }

    onMount(() => {
        if (typeof window !== 'undefined') {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isOpen) {
                    isOpen = false;
                    searchQuery = '';
                }
            });

            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    });
</script>

<div class="relative {classes}" bind:this={selectRef}>
    <button
        type="button"
        class="w-full px-3 py-2 text-left bg-white dark:bg-zinc-800 border border-zinc-500/25 rounded-lg shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors flex items-center justify-between {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
        onclick={() => {
            if (!disabled) {
                isOpen = !isOpen;
                if (isOpen) setTimeout(() => inputRef?.focus(), 50);
            }
        }}
        onkeydown={handleKeydown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
    >
        <span class="block truncate {value === null ? 'text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}">
            {optionLabel}
        </span>
        <div class="flex items-center gap-2">
            {#if value !== null && isNullable}
                <button
                    type="button"
                    class="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                    onclick={(e) => {
                        e.stopPropagation();
                        value = null;
                    }}
                    aria-label="Clear selection"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            {/if}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </div>
    </button>
    
    {#if isOpen}
        <div 
            class="absolute w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-500/25 rounded-lg shadow z-50 overflow-hidden"
            transition:fade={{ duration: 100 }}
        >
            {#if searchable}
                <div class="p-2 border-b border-zinc-500/25">
                    <div class="relative">
                        <input
                            bind:this={inputRef}
                            bind:value={searchQuery}
                            type="text"
                            class="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-700/50 border border-zinc-500/25 rounded-md text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Type to search..."
                            onkeydown={handleSearchKeydown}
                        />
                        {#if searchQuery}
                            <button
                                type="button"
                                class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-md transition-colors"
                                onclick={() => searchQuery = ''}
                                aria-label="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        {/if}
                    </div>
                </div>
            {/if}

            <div class="{maxHeight} overflow-y-auto scrollbar-hidden">
                {#if filteredOptions.length === 0}
                    <div class="p-2 text-sm text-zinc-500 dark:text-zinc-400 text-center">
                        No results found
                    </div>
                {:else}
                    {#each filteredOptions as option, i}
                        <button 
                            type="button"
                            data-option-button
                            class="w-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors text-left flex items-center justify-between group {value === option.value ? 'bg-zinc-100 dark:bg-zinc-700' : ''}"
                            onclick={() => handleOptionClick(option)}
                            onkeydown={(e) => handleOptionKeydown(e, option, i)}
                        >
                            <span class="text-zinc-900 dark:text-zinc-100">{option.label}</span>
                            {#if value === option.value && isNullable}
                                <span class="text-sm text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to deselect
                                </span>
                            {/if}
                        </button>
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div> 