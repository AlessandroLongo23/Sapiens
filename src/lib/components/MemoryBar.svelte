<script>
    let { memory } = $props();

    let color = $derived.by(() => {
        const hue = (memory / 100) * 120;
        return `hsl(${hue}, 90%, 45%)`;
    });
</script>

<div class="flex flex-row gap-2 w-4 h-full">
    <div class="w-4 bg-zinc-200 rounded-full h-full overflow-hidden">
        <div class="relative w-4 h-full" style="top: {100 - memory}%; height: {memory}%; background-color: {color}"></div>
    </div>
</div>

