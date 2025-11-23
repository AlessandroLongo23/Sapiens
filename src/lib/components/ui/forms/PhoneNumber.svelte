<script>
    import { onMount } from 'svelte';
    import { prefixes } from '$lib/const/prefixes'
    import { ChevronDown } from 'lucide-svelte';

    let { 
        prefixCode = $bindable(null),
        phoneNumber = $bindable(null), 
        classes = $bindable(null),
    } = $props();
    
    let prefix = $state({})
    let showPrefixDropdown = $state(false);
    let inputRef;

    let searchQuery = $state('');

    let filteredPrefixes = $derived(
        prefixes
            .filter(p => p.country.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.country.localeCompare(b.country))
    );

    onMount(() => {
        prefix = prefixes.find(p => p.code == prefixCode)
        if (prefix) {
            selectPrefix(prefix);
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });

    const isLetter = (key) => {
        return key.length === 1 && key.match(/[a-zA-Z]/);
    };
    
    const formatNumber = (val) => {
        const cleaned = val.replace(/\D/g, '');
        const prefixFormat = prefix.format;
        const matches = cleaned.match(prefixFormat);
        if (!matches) return cleaned;
        
        return matches.slice(1).filter(group => group).join(' ');
    };

    const handleNumberInput = (e) => {
        const val = e.target.value.replace(/\s/g, '');
        phoneNumber = formatNumber(val);
    };
    
    const selectPrefix = (newPrefix) => {
        prefix = newPrefix;
        prefixCode = newPrefix.code;
        phoneNumber = formatNumber(phoneNumber.replace(/\s/g, ''));
        showPrefixDropdown = false;
        searchQuery = '';
        inputRef?.focus();
    };

    const handleClickOutside = (e) => {
        if (e.target.closest('.prefix-selector')) return;
        showPrefixDropdown = false;
        searchQuery = '';
    };
</script>

<div class="flex flex-row gap-2 {classes}">
    <div class="relative prefix-selector">
        <button
            type="button"
            class="h-full px-3 flex items-center gap-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-500/25 hover:border-zinc-500/50 transition-colors"
            onclick={() => {
                showPrefixDropdown = !showPrefixDropdown;
                searchQuery = '';
            }}
            onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    showPrefixDropdown = !showPrefixDropdown;
                    searchQuery = '';
                }

                if (e.key === 'Backspace') {
                    searchQuery = searchQuery.slice(0, -1);
                } else if (e.key === 'Escape') {
                    searchQuery = '';
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const buttons = document.querySelectorAll('[data-prefix-button]');
                    if (buttons.length > 0) buttons[0].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const buttons = document.querySelectorAll('[data-prefix-button]');
                    if (buttons.length > 0) buttons[buttons.length - 1].focus();
                } else if (isLetter(e.key)) {
                    searchQuery += e.key;
                }
            }}
        >
            <span class="text-zinc-900 dark:text-zinc-100">{prefix.code}</span>
            <ChevronDown class="size-4 text-zinc-500" />
        </button>

        {#if showPrefixDropdown}
            <div class="absolute max-h-72 overflow-y-auto scrollbar-hidden top-full left-0 mt-1 w-60 py-1 bg-white dark:bg-zinc-900 border border-zinc-500/25 rounded-lg shadow z-50">
                {#each filteredPrefixes as prefix}
                    <button
                        type="button"
                        class="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onclick={() => selectPrefix(prefix)}
                    >
                        <span class="text-zinc-900 dark:text-zinc-100">{prefix.code}</span>
                        <span class="text-sm text-zinc-500 ml-2">{prefix.country}</span>
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <input
        type="text"
        bind:this={inputRef}
        placeholder={prefix.placeholder || '000 000 0000'}
        class="flex p-2.5 max-w-[12rem] rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-500/25 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-colors"
        value={phoneNumber}
        oninput={handleNumberInput}
        aria-label="Phone number"
    />
</div>