<script>
    import * as ls from 'lucide-svelte';
    
    let { assignments = [] } = $props();
    
    // Sort by progress (highest first)
    let sortedAssignments = $derived(
        [...assignments].sort((a, b) => b.progress - a.progress)
    );
    
    // Get color based on progress
    function getProgressColor(progress) {
        if (progress >= 80) return 'bg-emerald-500 dark:bg-emerald-500';
        if (progress >= 50) return 'bg-blue-500 dark:bg-blue-500';
        if (progress >= 25) return 'bg-amber-500 dark:bg-amber-500';
        return 'bg-red-500 dark:bg-red-500';
    }
    
    // Get status label and icon
    function getStatusInfo(status, progress) {
        const statuses = {
            'assigned': { 
                label: 'Assegnato', 
                icon: ls.AlertCircle,
                color: 'text-amber-500 dark:text-amber-500'
            },
            'in_progress': { 
                label: 'In progresso', 
                icon: ls.Clock,
                color: 'text-blue-500 dark:text-blue-500'
            },
            'completed': { 
                label: 'Completato', 
                icon: ls.CheckCircle,
                color: 'text-emerald-500 dark:text-emerald-500'
            }
        };
        
        return statuses[status] || statuses.assigned;
    }
    
    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
</script>

<div class="topic-progress-list">
    <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Progressi per Argomento</h3>
    
    {#if sortedAssignments.length === 0}
        <div class="flex flex-col items-center justify-center py-8 text-center">
            <div class="text-zinc-400 dark:text-zinc-500 mb-3">
                <ls.BookX class="size-10 mx-auto" />
            </div>
            <p class="text-zinc-600 dark:text-zinc-400">Nessun argomento assegnato.</p>
        </div>
    {:else}
        <div class="grid gap-3">
            {#each sortedAssignments as assignment}
                {@const statusInfo = getStatusInfo(assignment.status, assignment.progress)}
                <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 transition-shadow hover:shadow-md">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-medium text-zinc-900 dark:text-zinc-100">{assignment.topic.title}</h4>
                        <div class="flex items-center gap-1">
                            {#if statusInfo.icon}
                                <div class="size-4 {statusInfo.color}">
                                    <statusInfo.icon />
                                </div>
                            {/if}
                            <span class="text-xs font-medium {statusInfo.color}">{statusInfo.label}</span>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <!-- Path info -->
                        <div class="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                            <ls.Folder class="size-3.5" />
                            <span>
                                {assignment.topic.path.join(' > ')}
                            </span>
                        </div>
                        
                        <!-- Progress bar -->
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs text-zinc-600 dark:text-zinc-400">Progress</span>
                                <span class="text-xs font-medium text-zinc-900 dark:text-zinc-100">{assignment.progress}%</span>
                            </div>
                            <div class="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div class="h-full transition-all duration-500 ease-out {getProgressColor(assignment.progress)}" style="width: {assignment.progress}%;"></div>
                            </div>
                        </div>
                        
                        <!-- Last activity -->
                        {#if assignment.last_activity}
                            <div class="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                                <ls.Calendar class="size-3.5" />
                                <span>
                                    Ultima attività: {formatDate(assignment.last_activity)}
                                </span>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
