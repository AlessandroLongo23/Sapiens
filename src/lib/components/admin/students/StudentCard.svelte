<script>
    import { GraduationCap, MapPin, BookOpen, Phone } from 'lucide-svelte';
    import { lecturesStore } from '$lib/stores/lectures.js';

    import MemoryBar from '$lib/components/MemoryBar.svelte';

    let { student } = $props();
</script>

<div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
    <div class="flex items-start justify-between gap-4 h-full">
        <div class="flex-1 space-y-4">
            <div>
                <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {student.getFullName()}
                </h3>
            </div>

            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                    <GraduationCap class="w-4 h-4 text-zinc-400" />
                    <span class="text-sm text-zinc-600 dark:text-zinc-400">
                        {student.level || 'N/A'}
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <MapPin class="w-4 h-4 text-zinc-400" />
                    <span class="text-sm text-zinc-600 dark:text-zinc-400">
                        {student.city || 'N/A'}
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <BookOpen class="w-4 h-4 text-zinc-400" />
                    <span class="text-sm text-zinc-600 dark:text-zinc-400">
                        {student.lectures?.length || 0} lezioni
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <Phone class="w-4 h-4 text-zinc-400" />
                    <span class="text-sm text-zinc-600 dark:text-zinc-400">
                        {student.getPhone() || 'N/A'}
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