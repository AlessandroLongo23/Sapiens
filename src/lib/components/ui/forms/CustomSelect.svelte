<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { X, ChevronDown } from 'lucide-svelte';

    let { 
        value = $bindable(),
        options = [],
        labelKey = 'name',
        valueKey = 'id',
        placeholder = 'Seleziona un\'opzione', 
        isNullable = false,
        disabled = false,
        searchable = true,
        addable = false,
        maxHeight = 'max-h-40',
        classes = '',
        onAddNewOption = () => {},
        onchange = () => {}
    } = $props();

    const getLabel = (option) => {
        if (typeof labelKey === 'function') {
            return labelKey(option);
        }
        return option[labelKey];
    }

    let isOpen = $state(false);
    let searchQuery = $state('');
    let inputRef = $state(null);
    let selectRef = $state(null);
    let selectedOptionLabel = $derived.by(() => {
        let option = options.find(option => option[valueKey] === value);
        if (!option) return placeholder;
        return getLabel(option);
    });

    let filteredOptions = $derived.by(() => {
        if (searchable && searchQuery) {
            return options.filter(option => getLabel(option).toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return options;
    });

    const addNewOption = async (option) => {
        let obj = new Object();
        obj[labelKey] = getLabel(option);
        obj[valueKey] = option.value;
        delete obj.id;
        let newOption = await onAddNewOption(obj);

        handleOptionClick(newOption);
    }

    const handleOptionClick = (option) => {
        if (value === option[valueKey] && isNullable) {
            value = null;
        } else {
            value = option[valueKey];
        }
        isOpen = false;
        searchQuery = '';
        onchange(value);
    }

    const handleKeydown = (event) => {
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
            handleOptionClick(filteredOptions[0], valueKey);
        } else if (event.key === 'Escape') {
            isOpen = false;
            searchQuery = '';
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const buttons = document.querySelectorAll('[data-option-button]');
            if (buttons.length > 0) buttons[0].focus();
        }
    }

    const handleOptionKeydown = (event, option, index) => {
        if (event.key === 'Enter') {
            handleOptionClick(option, valueKey);
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

    const handleClickOutside = (event) => {
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
    <div
        type="button"
        role="button"
        tabindex="0"
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
        <span class="block truncate {selectedOptionLabel === placeholder ? 'text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}">
            {selectedOptionLabel}
        </span>
        <div class="flex items-center gap-2">
            {#if value !== null && isNullable}
                <button
                    type="button"
                    class="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                    onclick={(e) => {
                        e.stopPropagation();
                        value = null;
                        onchange(null);
                    }}
                    aria-label="Cancella selezione"
                >
                    <X class="size-4 text-zinc-500" />
                </button>
            {/if}
            <ChevronDown class="size-5 text-zinc-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
        </div>
    </div>
    
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
                            placeholder="Cerca..."
                            onkeydown={handleSearchKeydown}
                            onchange={() => onchange(searchQuery)}
                        />
                        {#if searchQuery}
                            <button
                                type="button"
                                class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-md transition-colors"
                                onclick={() => searchQuery = ''}
                                aria-label="Clear search"
                            >
                                <X class="size-4 text-zinc-400" />
                            </button>
                        {/if}
                    </div>
                </div>
            {/if}

            <div class="{maxHeight} overflow-y-auto scrollbar-hidden">
                {#if filteredOptions.length === 0}
                    {#if addable && searchQuery.length >= 3}
                        <button
                            type="button"
                            class="w-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors text-left flex items-center justify-between group"
                            onclick={() => addNewOption({label: searchQuery, value: searchQuery.toLowerCase().replace(/ /g, '-') })}
                            onchange={() => onchange(searchQuery)}
                        >
                            <span class="text-zinc-900 dark:text-zinc-100">Aggiungi {searchQuery}</span>
                        </button>
                    {:else}
                        <div class="p-2 text-sm text-zinc-500 dark:text-zinc-400 text-center">
                            Nessun risultato
                        </div>
                    {/if}
                {:else}
                    {#each filteredOptions as option, i}
                        <button 
                            type="button"
                            data-option-button
                            class="w-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors text-left flex items-center justify-between group {value === option[valueKey] ? 'bg-zinc-100 dark:bg-zinc-700' : ''}"
                            onclick={() => handleOptionClick(option)}
                            onkeydown={(e) => handleOptionKeydown(e, option, i)}
                            onchange={() => onchange(option[valueKey])}
                        >
                            <span class="text-zinc-900 dark:text-zinc-100">{getLabel(option)}</span>
                            {#if value === option[valueKey] && isNullable}
                                <span class="text-sm text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Clicca per deselezionare
                                </span>
                            {/if}
                        </button>
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div> 