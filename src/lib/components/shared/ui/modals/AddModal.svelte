<script>
    import { Plus, X, Check } from 'lucide-svelte';
    import Modal from '$lib/components/shared/ui/modals/Modal.svelte';

    let { 
        isOpen = $bindable(false),
        title = 'Aggiungi',
        subtitle = 'Aggiungi un nuovo elemento',
        onClose = () => {},
        onSubmit = () => {},
        children,
        classes = ''
    } = $props();
</script>

<Modal 
    bind:isOpen={isOpen} 
    onClose={onClose} 
    classes={classes}
>
    <div class="flex flex-col bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-xl w-full">
        <div class="flex flex-row items-center justify-between p-6 border-b border-zinc-500/25">
            <div class="flex flex-row items-center gap-3 truncate">
                <div class="flex flex-shrink-0 items-center justify-center size-10 rounded-lg bg-emerald-500/10">
                    <Plus class="size-5 text-emerald-500"/>
                </div>
                <div class="flex flex-col truncate">
                    <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
                    <p class="text-sm text-zinc-600 dark:text-zinc-400 truncate">{subtitle}</p>
                </div>
            </div>
            <button 
                class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                onclick={onClose}
            >
                <X class="size-5"/>
            </button>
        </div>

        <div class="p-6">
            {@render children()}
        </div>

        <div class="flex flex-row items-center justify-end gap-3 p-6 border-t border-zinc-500/25">
            <button 
                type="button"
                class="flex flex-row items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors text-zinc-900 dark:text-zinc-100"
                onclick={onClose}
            >
                <X class="size-4"/>
                Annulla
            </button>
            <button 
                type="button"
                class="flex flex-row items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                onclick={onSubmit}
            >
                <Check class="size-4"/>
                Aggiungi
            </button>
        </div>
    </div>
</Modal> 