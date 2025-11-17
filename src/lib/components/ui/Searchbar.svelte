<script lang="ts">
    import { searchStore } from '$lib/components/ui/search';
    import { Search, X } from 'lucide-svelte';
    
    let inputRef: HTMLInputElement | null = null;
    let isMac = $state(false);

    let { 
        placeholder = 'Cerca', 
        isNullable = true, 
        hasKeyboardShortcut = true,
        width = 'w-full',
        autofocus = false,
        size = 'md',
        classes = ''
    } = $props();

    const sizeClasses = {
        md: {
            input: 'h-10 py-2 pl-9 pr-8 text-sm',
            searchIcon: {
                size: 'size-5',
                left: 'left-2',
            },
            xIcon: {
                size: 'size-4',
                right: 'right-2',
            }
        },
        lg: {
            input: 'h-12 py-3 pl-12 pr-10 text-md',
            searchIcon: {
                size: 'size-6',
                left: 'left-3',
            },
            xIcon: {
                size: 'size-5',
                right: 'right-3',
            }
        },
        xl: {
            input: 'h-14 py-4 pl-15 pr-12 text-lg',
            searchIcon: {
                size: 'size-7',
                left: 'left-4',
            },
            xIcon: {
                size: 'size-5',
                right: 'right-4',
            }
        },
    }

    const focusInput = () => requestAnimationFrame(() => inputRef?.focus());
    const blurInput = () => inputRef?.blur();

    const handleShortcutToggle = () => {
        if ($searchStore?.isActive) {
            searchStore.deactivate();
            blurInput();
            return;
        }

        searchStore.activate();
        focusInput();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            handleShortcutToggle();
        }

        if (e.key === 'Escape') {
            searchStore.clear();
            blurInput();
        }
    };

    const handleFocus = () => {
        searchStore.activate();
    };

    const handleBlur = () => {
        searchStore.deactivate();
    };

    const handleClear = () => {
        searchStore.clear();
        focusInput();
    };

    $effect(() => {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    $effect(() => {
        if (autofocus && $searchStore?.isActive) {
            focusInput();
        }
    });
</script>

<div class={`relative flex items-center ${width} ${classes}`}>
    <div class="absolute {sizeClasses[size].searchIcon.left} text-zinc-400">
        <Search class={sizeClasses[size].searchIcon.size} />
    </div>
    
    <input
        bind:this={inputRef}
        type="text"
        placeholder={placeholder}
        class="w-full {sizeClasses[size].input} bg-white dark:bg-zinc-900 border rounded-lg
               dark:border-zinc-800 border-zinc-200
               dark:focus:border-zinc-700 focus:border-zinc-300
               dark:text-zinc-100 text-zinc-900
               placeholder:text-zinc-400
               outline-none transition-all duration-200"
        value={$searchStore?.query}
        oninput={(e: Event) => searchStore.setQuery((e.target as HTMLInputElement).value)}
        onfocus={handleFocus}
        onblur={handleBlur}
    />
    
    {#if $searchStore?.query && isNullable}
        <button
            class="absolute {sizeClasses[size].xIcon.right} p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md
                   transition-colors duration-200"
            onclick={handleClear}
            aria-label="Clear search"
        >
            <X class={sizeClasses[size].xIcon.size} />
        </button>
    {:else}
        {#if hasKeyboardShortcut}
            <div
                class="absolute right-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md text-sm
                    transition-colors duration-200 px-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-500/25"
                onclick={() => searchStore.clear()}
                aria-label="Clear search"
            >
                {isMac ? '⌘ + K' : 'Ctrl + K'}
            </div>
        {/if}
    {/if}
</div>