<script>
    import { Calendar, Clock } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
	import { format } from 'date-fns';

	let { lecture } = $props();
    const dispatch = createEventDispatcher();
</script>

<button 
    class="w-full text-left p-3 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
    onclick={() => dispatch('openLectureModal', lecture)}
>
    <div class="flex justify-between">
        <span class="flex flex-row items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
            <Calendar size={16} /> 
            {format(new Date(lecture.date), 'EEE, MMM d')}
        </span>
        <span class="flex flex-row items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Clock size={16} /> 
            {lecture.start_time} - {lecture.end_time}
        </span>
    </div>

    <div class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        {#if lecture.student}
            {lecture.student.name} {lecture.student.last_name}
        {:else}
            Unknown Student
        {/if}
        {#if lecture.subject}
            - {lecture.subject.name}
        {/if}
    </div>

    {#if lecture.level}
        <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {lecture.level === 'high_school' ? 'High School' : 'University'}
        </div>
    {/if}
</button>