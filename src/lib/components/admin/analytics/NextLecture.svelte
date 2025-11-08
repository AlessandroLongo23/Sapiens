<script lang="ts">
	import { formatDateDisplay } from '$lib/utils/format.svelte';
	import { lecturesStore } from '$lib/stores/lectures.js';	
	import { Calendar } from 'lucide-svelte';
	import { isAfter} from 'date-fns';
	import { Lecture } from '$lib/models/Lecture.svelte';

    let nextLecture: Lecture = $derived.by(() => {
        const now: Date = new Date();
        const nextLectures: Lecture[] = $lecturesStore.lectures
            .filter((lecture: Lecture) => {
				return isAfter(new Date(lecture.date), now);
            })
            .sort((a: Lecture, b: Lecture) => {
                return isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1;
            });

		return nextLectures.length > 0 ? nextLectures[0] : null;
	});
</script>

{#if nextLecture}
	<div class="bg-white border-l-4 border-l-blue-500 border-t border-r border-b border-zinc-200 dark:bg-zinc-900 dark:border-l-blue-500 dark:border-t-zinc-700 dark:border-r-zinc-700 dark:border-b-zinc-700 rounded-md p-5 shadow-base dark:shadow-glow mb-8">
		<div class="flex items-center">
			<div class="p-3 rounded-md bg-blue-50 dark:bg-zinc-700 mr-4">
				<Calendar class="w-6 h-6 text-blue-500" />
			</div>

            <div>
				<h3 class="font-semibold text-zinc-900 dark:text-white text-sm mb-2">Next Lecture</h3>
				<div class="flex flex-wrap gap-x-8 gap-y-2 text-sm">
					<div class="flex items-center">
						<span class="text-xs text-zinc-500 dark:text-zinc-400">Date:</span> 
						<span class="text-sm text-zinc-900 dark:text-white font-medium ml-2">{formatDateDisplay(nextLecture.date)}</span>
					</div>
					<div class="flex items-center">
						<span class="text-xs text-zinc-500 dark:text-zinc-400">Time:</span> 
						<span class="text-sm text-zinc-900 dark:text-white font-medium ml-2">{nextLecture.start_time} - {nextLecture.end_time}</span>
					</div>
					<div class="flex items-center">
						<span class="text-xs text-zinc-500 dark:text-zinc-400">Student:</span> 
						<span class="text-sm text-zinc-900 dark:text-white font-medium ml-2">
							{nextLecture?.student?.getFullName()}
						</span>
					</div>
					<div class="flex items-center">
						<span class="text-xs text-zinc-500 dark:text-zinc-400">Subject:</span> 
						<span class="text-sm text-zinc-900 dark:text-white font-medium ml-2">{nextLecture.subject?.name}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if} 