<script>
    import * as ls from 'lucide-svelte';
    import Modal from '$lib/components/modals/Modal.svelte';

    let { 
        isOpen = $bindable(false),
        title = 'Conferma eliminazione', 
        onConfirm, 
        onClose = () => {},
        onCancel = () => {}, 
        confirmText = 'Elimina',
        cancelText = 'Annulla',
        mainIcon = ls.CircleAlert,
        mainColor = 'red',
        confirmIcon = ls.Trash2,
        classes = '',
        children
    } = $props();
</script>

<Modal bind:isOpen={isOpen} onClose={onClose} classes={classes}>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="flex flex-col justify-center bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full gap-8 p-8">
            <div class="flex flex-col gap-4">
                <div class="flex flex-row items-center justify-center">
                    <div class="relative">
                        <div class="absolute inset-0 bg-{mainColor}-500/5 rounded-full p-1 custom-animate-ping"></div>
                        <div class="flex flex-row items-center justify-center bg-{mainColor}-500/10 rounded-full p-2">
                            <svelte:component this={mainIcon} strokeWidth={1.5} class="size-8 text-{mainColor}-500"/>
                        </div>
                    </div>
                </div>

                <h2 class="text-xl font-bold text-center text-zinc-900 dark:text-zinc-100">{title}</h2>

                <div class="flex flex-col gap-4 text-center w-full justify-end text-zinc-900 dark:text-zinc-100">
                    {@render children()}
                </div>
            </div>

            <div class="flex flex-row items-center justify-center gap-4 w-full">
                <button 
                    class="flex flex-row flex-grow items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-zinc-900 dark:text-zinc-100"
                    onclick={onCancel}
                >
                    <ls.X class="size-4"/>
                    {cancelText}
                </button>
                <button 
                    class="flex flex-row flex-grow items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-{mainColor}-500 text-white hover:bg-{mainColor}-600 transition-colors"
                    onclick={onConfirm}
                >
                    <svelte:component this={confirmIcon} class="size-4"/>
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
</Modal>

<style>
    @keyframes ping {
        75%, 100% {
            transform: scale(1.75);
            opacity: 0;
        }
    }
    .custom-animate-ping {
        animation: ping 1.25s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
</style>