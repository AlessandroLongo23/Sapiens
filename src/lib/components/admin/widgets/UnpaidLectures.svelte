<script>
    import { lecturesStore } from '$lib/stores/lectures.js';
    import { studentsStore } from '$lib/stores/students.js';
    import { cardStyle } from '$lib/const/appearance.js';
    import { CreditCard, User } from 'lucide-svelte';

    
    let unpaidByStudent = $derived.by(() => {
        
        if ($lecturesStore.loading || $studentsStore.loading) {
            return [];
        }

        const unpaidMap = new Map();
        
        
        $lecturesStore.lectures
            .filter(lecture => !lecture.paid)
            .forEach(lecture => {
                
                const student = $studentsStore.students.find(s => s.id === lecture.student_id);
                if (!student) return;
                
                
                const startTime = lecture.start_time ? lecture.start_time.split(':').map(Number) : [0, 0];
                const endTime = lecture.end_time ? lecture.end_time.split(':').map(Number) : [0, 0];
                const durationHours = (endTime[0] - startTime[0]) + (endTime[1] - startTime[1]) / 60;
                const amount = durationHours * lecture.hourly_rate;
                
                
                if (unpaidMap.has(student.id)) {
                    const existing = unpaidMap.get(student.id);
                    existing.totalAmount += amount;
                    existing.lectures.push(lecture);
                } else {
                    unpaidMap.set(student.id, {
                        student,
                        totalAmount: amount,
                        lectures: [lecture]
                    });
                }
            });
        
        
        return Array.from(unpaidMap.values())
            .sort((a, b) => b.totalAmount - a.totalAmount);
    });
</script>

<div class={`p-4 ${cardStyle}`}>
    <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
        Pagamenti da Ricevere
    </h2>
    
    <div class="space-y-3 pr-0 md:pr-2">
        {#if $lecturesStore.loading || $studentsStore.loading}
            <p class="text-zinc-500 dark:text-zinc-400 text-sm">Caricamento...</p>
        {:else if unpaidByStudent.length === 0}
            <p class="text-zinc-500 dark:text-zinc-400 text-sm">Nessun pagamento pendente.</p>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {#each unpaidByStudent as { student, totalAmount, lectures }}
                    <div class="p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-700">
                                    <User size={16} class="text-zinc-600 dark:text-zinc-300" />
                                </div>
                                <span class="font-medium">{student.first_name} {student.last_name}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <CreditCard size={14} class="text-amber-500" />
                                <span class="font-bold text-amber-500">{totalAmount.toFixed(2)}€</span>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            {lectures.length} {lectures.length === 1 ? 'lezione' : 'lezioni'} non pagate
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
