<script>
	import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { studentsStore } from '$lib/stores/students.js';
    import { contentStore } from '$lib/stores/content.js';
    import { supabase } from '$lib/supabase.js';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import * as ls from 'lucide-svelte';
    
    import CalendarActivity from '$lib/components/admin/calendars/CalendarActivity.svelte';
    import CollapsibleTreeView from '$lib/components/admin/subjects/CollapsibleTreeView.svelte';
    import TopicProgressList from '$lib/components/admin/TopicProgressList.svelte';

    let studentId = $page.params.id;
    let student = $state(null);
    let loading = $state(true);
    let error = $state(null);
    
    let studentActivities = $state([]);
    let studentAssignments = $state([]);
    let selectedTopicIds = $state([]);
    let showAssignTopicsModal = $state(false);
    
    let currentAssignedTopics = $state([]);
    
    let streak = $state(0);
    let maxStreak = $state(0);
    let totalLogins = $state(0);
    let avgSessionTime = $state(0);
    let totalExercisesDone = $state(0);
    
    onMount(async () => {
        try {
            await studentsStore.fetchStudents();
            const studentData = $studentsStore.students.find(s => s.id === studentId);
            
            if (!studentData) {
                throw new Error('Student not found');
            }
            
            student = studentData;
            
            const { data: topicsData, error: topicsError } = await supabase
                .from('students')
                .select('assigned_topics')
                .eq('id', studentId)
                .single();
                
            if (topicsError) {
                console.error('Error fetching assigned topics:', topicsError);
            } else {
                currentAssignedTopics = topicsData.assigned_topics || [];
                
                selectedTopicIds = [...currentAssignedTopics];
            }
            
            studentActivities = generateMockActivities(90);
            
            calculateStudentStats();
            
            studentAssignments = await fetchStudentAssignments();
            
            loading = false;
        } catch (err) {
            console.error('Error loading student data:', err);
            error = err.message;
            loading = false;
        }
    });
    
    function calculateStudentStats() {
        let currentStreak = 0;
        let maxStreakCount = 0;
        let streakBroken = false;
        let totalLoginCount = 0;
        let sessionTimeSum = 0;
        let exerciseCount = 0;
        
        const sortedActivities = [...studentActivities].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        for (const activity of studentActivities) {
            if (activity.type === 'login') {
                totalLoginCount += activity.count || 1;
                sessionTimeSum += activity.duration || 0;
            }
            
            if (activity.type === 'exercise') {
                exerciseCount += activity.count || 1;
            }
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 60; i++) {
            const targetDate = new Date();
            targetDate.setDate(today.getDate() - i);
            targetDate.setHours(0, 0, 0, 0);
            
            const found = sortedActivities.find(a => {
                const activityDate = new Date(a.date);
                activityDate.setHours(0, 0, 0, 0);
                return activityDate.getTime() === targetDate.getTime();
            });
            
            if (found && !streakBroken) {
                currentStreak++;
            } else if (i === 0) {
                continue;
            } else {
                streakBroken = true;
            }
            
            if (currentStreak > maxStreakCount) {
                maxStreakCount = currentStreak;
            }
        }
        
        streak = currentStreak;
        maxStreak = maxStreakCount;
        totalLogins = totalLoginCount;
        avgSessionTime = totalLoginCount > 0 ? Math.round(sessionTimeSum / totalLoginCount) : 0;
        totalExercisesDone = exerciseCount;
    }
    
    async function fetchStudentAssignments() {
        try {
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('assigned_topics')
                .eq('id', studentId)
                .single();
                
            if (studentError) {
                throw new Error(`Failed to fetch student: ${studentError.message}`);
            }
            
            const assignedTopicIds = studentData?.assigned_topics || [];
            
            if (assignedTopicIds.length === 0) {
                return [];
            }
            
            const { data: contentNodes, error: contentError } = await supabase
                .from('content_nodes')
                .select('*')
                .in('id', assignedTopicIds);
                
            if (contentError) {
                throw new Error(`Failed to fetch content nodes: ${contentError.message}`);
            }
            
            return contentNodes.map(node => {
                const mockProgress = {
                    'completed': { progress: 100, last_activity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                    'in_progress': { progress: Math.floor(Math.random() * 70) + 30, last_activity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
                    'assigned': { progress: 0, last_activity: null }
                };
                
                const statuses = ['assigned', 'in_progress', 'completed'];
                const randomStatus = statuses[Math.floor(Math.random() * 3)];
                const progress = mockProgress[randomStatus];
                
                return {
                    id: node.id,
                    student_id: studentId,
                    topic: {
                        id: node.id,
                        title: node.title,
                        path: node.path || []
                    },
                    status: randomStatus,
                    progress: progress.progress,
                    assigned_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    last_activity: progress.last_activity?.toISOString().split('T')[0] || null
                };
            });
        } catch (err) {
            console.error('Error fetching student assignments:', err);
            return [];
        }
    }
    
    function generateMockActivities(days) {
        const activities = [];
        const today = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            
            if (Math.random() > 0.4) {
                const intensity = Math.floor(Math.random() * 5);
                const types = ['login', 'exercise', 'topic', 'lecture'];
                const type = types[Math.floor(Math.random() * types.length)];
                
                activities.push({
                    date: date.toISOString(),
                    type,
                    count: Math.floor(Math.random() * 5) + 1,
                    intensity,
                    duration: Math.floor(Math.random() * 60) + 15
                });
            }
        }
        
        return activities;
    }
    
    async function assignTopicsToStudent() {
        if (selectedTopicIds.length === 0) return;
        
        try {
            const { data, error } = await supabase
                .from('students')
                .update({ 
                    assigned_topics: selectedTopicIds 
                })
                .eq('id', studentId)
                .select();
            
            if (error) {
                throw new Error(`Failed to assign topics: ${error.message}`);
            }
            
            currentAssignedTopics = [...selectedTopicIds];
            
            studentAssignments = await fetchStudentAssignments();
            
            const topicCount = selectedTopicIds.length;
            const message = `${topicCount} ${topicCount === 1 ? 'argomento assegnato' : 'argomenti assegnati'} con successo!`;
            
            messagePopup.success(message);
            selectedTopicIds = [];
            showAssignTopicsModal = false;
        } catch (err) {
            console.error('Error assigning topics:', err);
        }
    }
    
    function formatMinutes(minutes) {
        if (minutes < 60) return `${minutes} min`;
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (remainingMinutes === 0) return `${hours} h`;
        return `${hours} h ${remainingMinutes} min`;
    }
</script>

{#if loading}
    <div class="flex justify-center items-center py-20">
        <ls.Loader class="size-8 text-blue-600 dark:text-blue-400 animate-spin" />
    </div>
{:else if error}
    <div class="flex flex-col items-center justify-center py-10">
        <div class="text-red-600 dark:text-red-500 mb-3">
            <ls.AlertCircle class="size-12 mx-auto" />
        </div>
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Error</h2>
        <p class="text-zinc-600 dark:text-zinc-400">{error}</p>
    </div>
{:else if student}
    <div class="space-y-8">
        <div class="flex items-start justify-between">
            <div>
                <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-2">
                    <div class="size-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <ls.User class="size-5" />
                    </div>
                    <span>{student.first_name} {student.last_name}</span>
                </h1>
                
                <div class="text-sm text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                    <div class="flex items-center gap-1.5">
                        <ls.School class="size-4" />
                        <span>{student.level}</span>
                    </div>
                    
                    {#if student.city}
                        <div class="flex items-center gap-1.5">
                            <ls.MapPin class="size-4" />
                            <span>{student.city}</span>
                        </div>
                    {/if}
                    
                    {#if student.phone}
                        <div class="flex items-center gap-1.5">
                            <ls.Phone class="size-4" />
                            <span>{student.phone}</span>
                        </div>
                    {/if}
                    
                    <div class="flex items-center gap-1.5">
                        <ls.Mail class="size-4" />
                        <span>{student.email || 'email@example.com'}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex gap-3">
                <button class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5">
                    <ls.Calendar class="size-4" />
                    <span>Pianifica Lezione</span>
                </button>
                
                <button 
                    class="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                    onclick={() => {
                        selectedTopicIds = [...currentAssignedTopics];
                        showAssignTopicsModal = true;
                    }}
                >
                    <ls.BookOpen class="size-4" />
                    <span>Assegna Argomenti</span>
                </button>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Streak Attuale</h3>
                    <div class="size-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                        <ls.Flame class="size-5" />
                    </div>
                </div>
                
                <div class="flex items-baseline">
                    <span class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{streak}</span>
                    <span class="ml-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">giorni</span>
                </div>
                
                <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                    Streak massimo: {maxStreak} giorni
                </div>
            </div>
            
            <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Accessi Totali</h3>
                    <div class="size-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <ls.LogIn class="size-5" />
                    </div>
                </div>
                
                <div class="flex items-baseline">
                    <span class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalLogins}</span>
                </div>
                
                <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                    Nell'ultimo mese
                </div>
            </div>
            
            <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tempo Medio Sessione</h3>
                    <div class="size-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <ls.Clock class="size-5" />
                    </div>
                </div>
                
                <div class="flex items-baseline">
                    <span class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{formatMinutes(avgSessionTime)}</span>
                </div>
                
                <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                    Basato su {totalLogins} sessioni
                </div>
            </div>
            
            <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Esercizi Completati</h3>
                    <div class="size-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <ls.CheckSquare class="size-5" />
                    </div>
                </div>
                
                <div class="flex items-baseline">
                    <span class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalExercisesDone}</span>
                </div>
                
                <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                    Tasso completamento: 92%
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="col-span-1">
                <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
                    <TopicProgressList assignments={studentAssignments} />
                </div>
            </div>
            
            <div class="col-span-1 lg:col-span-2">
                <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
                    <CalendarActivity activities={studentActivities} months={3} />
                </div>
            </div>
        </div>

        <div>
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Lezioni Recenti</h2>
                <a href="/admin/calendario" class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <span>Vedi tutte</span>
                    <ls.ChevronRight class="size-4" />
                </a>
            </div>
            
            <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                        <thead>
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Data</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Argomento</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Durata</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Stato</th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Azioni</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">21 Apr 2023</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">Numeri Naturali</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">60 min</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                        Completata
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                        <ls.Eye class="size-4" />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">14 Apr 2023</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">Potenze</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">45 min</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                        Completata
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                        <ls.Eye class="size-4" />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">7 Apr 2023</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">Insiemi</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">60 min</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                        Completata
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                        <ls.Eye class="size-4" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    {#if showAssignTopicsModal}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50">
            <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                <div class="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
                    <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Assegna Argomenti</h3>
                    <button 
                        class="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        onclick={() => showAssignTopicsModal = false}
                    >
                        <ls.X class="size-5" />
                    </button>
                </div>
                
                <div class="p-6 flex-1 overflow-y-auto">
                    <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        Seleziona gli argomenti da assegnare a {student.first_name} {student.last_name}:
                    </p>
                    
                    <CollapsibleTreeView 
                        selectedIds={currentAssignedTopics} 
                        on:change={(e) => selectedTopicIds = e.detail}
                    />
                </div>
                
                <div class="border-t border-zinc-200 dark:border-zinc-700 px-6 py-4 flex justify-between items-center">
                    <div class="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedTopicIds.length} argomenti selezionati
                    </div>
                    
                    <div class="flex gap-3">
                        <button 
                            class="px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                            onclick={() => showAssignTopicsModal = false}
                        >
                            Annulla
                        </button>
                        
                        <button 
                            class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedTopicIds.length === 0}
                            onclick={assignTopicsToStudent}
                        >
                            Assegna
                        </button>
                    </div>
                </div>
            </div>
</div>
    {/if}
{/if}