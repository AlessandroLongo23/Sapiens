<script>
    import StudentCard from '$lib/components/students/StudentCard.svelte';

    let { students } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each students as student}
        <StudentCard {student} />
    {/each}
</div>