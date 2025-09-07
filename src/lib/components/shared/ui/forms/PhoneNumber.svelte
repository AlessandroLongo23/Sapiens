<script>
    import { onMount } from 'svelte';
    import * as ls from 'lucide-svelte';

    
    let { value = '', onChange = () => {} } = $props();

    
    let prefix = $state('+39'); 
    let number = $state('');
    let showPrefixDropdown = $state(false);
    let inputRef;

    
    const prefixes = [
        { code: '+39', country: 'Italia', format: /(\d{0,3})(\d{0,3})(\d{0,4})/ },
        { code: '+41', country: 'Svizzera', format: /(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/ },
        { code: '+43', country: 'Austria', format: /(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,3})/ },
        { code: '+33', country: 'Francia', format: /(\d{0,1})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/ },
        { code: '+49', country: 'Germania', format: /(\d{0,3})(\d{0,4})(\d{0,4})/ },
        { code: '+44', country: 'Regno Unito', format: /(\d{0,2})(\d{0,4})(\d{0,4})/ },
    ];

    
    const formatNumber = (val) => {
        
        const cleaned = val.replace(/\D/g, '');
        
        
        const prefixFormat = prefixes.find(p => p.code === prefix)?.format || /(\d{0,3})(\d{0,3})(\d{0,4})/;
        
        
        const matches = cleaned.match(prefixFormat);
        if (!matches) return cleaned;
        
        
        return matches.slice(1).filter(group => group).join(' ');
    };

    const handleNumberInput = (e) => {
        const val = e.target.value.replace(/\s/g, '');
        number = formatNumber(val);
        
        const fullNumber = `${prefix}${number.replace(/\s/g, '')}`;
        onChange(fullNumber);
    };

    
    const selectPrefix = (newPrefix) => {
        prefix = newPrefix;
        showPrefixDropdown = false;
        
        
        number = formatNumber(number.replace(/\s/g, ''));
        
        
        const fullNumber = `${prefix}${number.replace(/\s/g, '')}`;
        onChange(fullNumber);
        
        
        inputRef?.focus();
    };

    
    const handleClickOutside = (e) => {
        if (e.target.closest('.prefix-selector')) return;
        showPrefixDropdown = false;
    };

    onMount(() => {
        
        if (value) {
            const match = value.match(/(\+\d{2})(.*)/);
            if (match) {
                prefix = match[1];
                number = formatNumber(match[2]);
            }
        }

        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });
</script>

<div class="flex flex-row items-stretch gap-2">
    <div class="relative prefix-selector">
        <button
            type="button"
            class="h-full px-3 flex items-center gap-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-500/25 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
            onclick={() => showPrefixDropdown = !showPrefixDropdown}
        >
            <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{prefix}</span>
            <ls.ChevronDown class="size-4 text-zinc-500" />
        </button>

        {#if showPrefixDropdown}
            <div class="absolute max-h-36 overflow-y-auto scrollbar-hidden top-full left-0 mt-1 w-48 py-1 bg-white dark:bg-zinc-900 border border-zinc-500/25 rounded-lg shadow z-50">
                {#each prefixes as { code, country }}
                    <button
                        type="button"
                        class="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onclick={() => selectPrefix(code)}
                    >
                        <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{code}</span>
                        <span class="text-sm text-zinc-500 ml-2">{country}</span>
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <input
        type="text"
        bind:this={inputRef}
        placeholder="123 456 789"
        class="flex-1 p-2.5 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-500/25 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 transition-colors"
        value={number}
        oninput={handleNumberInput}
    />
</div>