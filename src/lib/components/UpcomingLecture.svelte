<script>
    import { studentsStore } from '$lib/stores/students.js';
    import { subjectsStore } from '$lib/stores/subjects.js';
    import { lecturesStore } from '$lib/stores/lectures.js';
    import { createEventDispatcher } from 'svelte';
	import { it } from 'date-fns/locale';
	import { format } from 'date-fns';
    import * as ls from 'lucide-svelte';

	let { lecture } = $props();

    const dispatch = createEventDispatcher();

    let student = $derived.by(() => {
        return $studentsStore.students.find(student => student.id === lecture.student_id);
    });

    let subject = $derived.by(() => {
        return $subjectsStore.subjects.find(subject => subject.id === lecture.subject_id);
    });

    let meetLink = $state(lecture?.meet_link ?? null);
    let creating = $state(false);

    const handleStartMeet = async (event) => {
        event.stopPropagation();
        if (creating) return;
        creating = true;
        try {
            const summary = `Lezione con ${student?.first_name ?? ''} ${student?.last_name ?? ''} - ${subject?.name ?? ''}`.trim();
            const res = await fetch('/api/create-meet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lectureId: lecture.id,
                    summary,
                    date: lecture.date,
                    start_time: lecture.start_time,
                    end_time: lecture.end_time
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Errore nella creazione del Meet');
            meetLink = data.hangoutLink;
            try {
                await lecturesStore.updateLecture(lecture.id, { meet_link: meetLink, google_event_id: data.eventId });
            } catch (_) {}
        } catch (err) {
            console.error(err);
        } finally {
            creating = false;
        }
    }

    const handleEnterMeet = (event) => {
        event.stopPropagation();
        if (meetLink) {
            window.open(meetLink, '_blank', 'noopener');
        }
    }
</script>

<div 
    class="flex flex-col gap-3 w-full text-left p-3 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
    role="button"
    tabindex="0"
    onclick={() => dispatch('openLectureModal', lecture)}
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch('openLectureModal', lecture) } }}
>
    <div class="flex justify-between">
        <span class="flex flex-row items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
            <ls.Calendar size={16} /> 
            {format(new Date(lecture.date), 'EEE d MMMM', { locale: it })}
        </span>
        <span class="flex flex-row items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <ls.Clock size={16} /> 
            {lecture.start_time} - {lecture.end_time}
        </span>
    </div>

    <div class="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-300">
        <div class="flex flex-row items-center gap-2">
            <ls.User size={16} />
            {student.first_name} {student.last_name}
        </div>
        <div class="flex flex-row items-center gap-2">
            <ls.BookOpen size={16} />
            {subject.name}
        </div>
        <div class="flex flex-row items-center gap-2 ">
            <ls.School size={12}/>
            {lecture.level === 'high_school' ? 'Scuola Superiore' : 'Università'}
        </div>
    </div>

    <div class="mt-2 flex items-center gap-2">
        {#if meetLink}
            <button
                class="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                onclick={handleEnterMeet}
            >
                Enter
            </button>
        {:else}
            <button
                class="px-3 py-1.5 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                disabled={creating}
                onclick={handleStartMeet}
            >
                {creating ? 'Creating…' : 'Start'}
            </button>
        {/if}
    </div>
</div>