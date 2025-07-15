<script>
    import { fly } from 'svelte/transition';
    import { CheckCircle, Info, AlertTriangle } from 'lucide-svelte';

    let { 
        message = '',
        type = 'info',
        duration = 3000,
        position = 'top-right'
    } = $props();

    const positions = {
        'top-right': 'top-4 right-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
        'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    };

    const types = {
        info: 'bg-blue-100 border-blue-500 text-blue-700',
        success: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700'
    };

    let Icon = $derived(
        type === 'info' ? Info :
        type === 'success' ? CheckCircle :
        AlertTriangle
    );
</script>

<div 
    class="fixed {positions[position]} px-4 py-3 rounded shadow z-50 {types[type]} flex items-center gap-2"
    transition:fly={{ x: position.includes('right') ? 300 : 0, y: position.includes('bottom') ? 300 : 0, duration: 300 }}
>
    <Icon class="size-5" />
    {message}
</div>