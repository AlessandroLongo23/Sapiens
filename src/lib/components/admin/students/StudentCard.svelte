<script>
    import { lecturesStore } from '$lib/stores/lectures/lectures.js';
    import { levels } from '$lib/stores/students/students.js';
    import * as ls from 'lucide-svelte';
    
    import MemoryBar from '$lib/components/MemoryBar.svelte';

    let { student } = $props();

    const lecturesDone = $derived($lecturesStore.lectures.filter(lecture => lecture.student_id === student.id).length)
</script>

<div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
    <div class="flex items-start justify-between gap-4 h-full">
        <div class="flex-1 space-y-4">
            <div>
                <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {student.first_name} {student.last_name}
                </h3>
            </div>

            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                    <ls.GraduationCap class="w-4 h-4 text-zinc-400" />
                    <span class="text-sm text-zinc-600 dark:text-zinc-400">
                        {levels.find(level => level.value === student.level)?.label || 'N/A'}
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <ls.MapPin class="w-4 h-4 text-zinc-400" />
                    <span class="text-sm text-zinc-600 dark:text-zinc-400">
                        {student.city || 'N/A'}
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <ls.BookOpen class="w-4 h-4 text-zinc-400" />
                    <span class="text-sm text-zinc-600 dark:text-zinc-400">
                        {lecturesDone} lezioni
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <ls.Phone class="w-4 h-4 text-zinc-400" />
                    <span class="text-sm text-zinc-600 dark:text-zinc-400">
                        {student.phone || 'N/A'}
                    </span>
                </div>
            </div>
        </div>

        <div class="flex flex-col items-center gap-2 h-full">
            <div class="flex-grow">
                <MemoryBar memory={student.memory || 0} />
            </div>
            <span class="text-xs text-zinc-500 dark:text-zinc-400">
                {student.memory || 0}%
            </span>
        </div>
    </div>
</div>