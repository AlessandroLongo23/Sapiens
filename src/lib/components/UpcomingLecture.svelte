<script>
    import { studentsStore } from '$lib/stores/students/students.js';
    import { subjectsStore } from '$lib/stores/subjects/subjects.js';
    import { createEventDispatcher } from 'svelte';
    import * as ls from 'lucide-svelte';
	import { format } from 'date-fns';
	import { it } from 'date-fns/locale';

	let { lecture } = $props();

    const dispatch = createEventDispatcher();

    let student = $derived.by(() => {
        return $studentsStore.students.find(student => student.id === lecture.student_id);
    });

    let subject = $derived.by(() => {
        return $subjectsStore.subjects.find(subject => subject.id === lecture.subject_id);
    });
</script>

<button 
    class="w-full text-left p-3 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
    onclick={() => dispatch('openLectureModal', lecture)}
>
    <div class="flex justify-between">
        <span class="flex flex-row items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
            <ls.Calendar size={16} /> 
            {format(new Date(lecture.date), 'EEE, MMM d', { locale: it })}
        </span>
        <span class="flex flex-row items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <ls.Clock size={16} /> 
            {lecture.start_time} - {lecture.end_time}
        </span>
    </div>

    <div class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        {student.first_name} {student.last_name} - {subject.name}
    </div>

    {#if lecture.level}
        <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {lecture.level === 'high_school' ? 'High School' : 'University'}
        </div>
    {/if}
</button>