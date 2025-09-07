<script>
    import * as ls from 'lucide-svelte';
    
    let { activities = [], months = 3 } = $props();
    
    
    let endDate = $state(new Date());
    let startDate = $derived(new Date(endDate.getFullYear(), endDate.getMonth() - months, endDate.getDate()));
    
    
    let days = $derived(() => {
        const result = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            result.push({
                date: new Date(currentDate),
                activity: activities.find(a => 
                    new Date(a.date).setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0)
                ) || null
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return result;
    });
    
    
    let weeks = $derived(() => {
        const result = [];
        let week = [];
        
        
        const firstDay = days[0].date.getDay();
        for (let i = 0; i < firstDay; i++) {
            week.push(null);
        }
        
        for (const day of days) {
            week.push(day);
            
            if (week.length === 7) {
                result.push(week);
                week = [];
            }
        }
        
        
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            result.push(week);
        }
        
        return result;
    });
    
    
    function getActivityClass(day) {
        if (!day || !day.activity) return 'activity-level-0';
        
        const intensity = day.activity.intensity || 0;
        return `activity-level-${Math.min(4, Math.max(0, intensity))}`;
    }
    
    
    function formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('it-IT', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    
    function getActivityDescription(day) {
        if (!day || !day.activity) return 'No activity';
        
        const { type, count } = day.activity;
        
        const descriptions = {
            'login': `Logged in ${count} ${count === 1 ? 'time' : 'times'}`,
            'lecture': `${count} ${count === 1 ? 'lecture' : 'lectures'}`,
            'exercise': `${count} ${count === 1 ? 'exercise' : 'exercises'} completed`,
            'topic': `${count} ${count === 1 ? 'topic' : 'topics'} studied`
        };
        
        return descriptions[type] || `${count} activities`;
    }
</script>

<div class="activity-calendar">
    <div class="activity-header flex justify-between items-center mb-4">
        <div class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Activity Calendar</div>
        <div class="flex items-center gap-2">
            <button 
                class="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                onclick={() => {
                    const newEnd = new Date(endDate);
                    newEnd.setMonth(newEnd.getMonth() - months);
                    endDate = newEnd;
                }}
            >
                <ls.ChevronLeft class="size-4" />
            </button>
            
            <div class="text-sm text-zinc-600 dark:text-zinc-400">
                {startDate.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })} - 
                {endDate.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })}
            </div>
            
            <button 
                class="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                onclick={() => {
                    const today = new Date();
                    const newEnd = new Date(endDate);
                    newEnd.setMonth(newEnd.getMonth() + months);
                    
                    if (newEnd > today) {
                        endDate = today;
                    } else {
                        endDate = newEnd;
                    }
                }}
                disabled={endDate >= new Date()}
            >
                <ls.ChevronRight class="size-4" />
            </button>
        </div>
    </div>
    
    <div class="calendar-grid">
        
        <div class="weekday-labels grid grid-cols-7 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <div class="text-center">Dom</div>
            <div class="text-center">Lun</div>
            <div class="text-center">Mar</div>
            <div class="text-center">Mer</div>
            <div class="text-center">Gio</div>
            <div class="text-center">Ven</div>
            <div class="text-center">Sab</div>
        </div>
        
        
        <div class="calendar-weeks">
            {#each weeks as week}
                <div class="grid grid-cols-7 gap-1 mb-1">
                    {#each week as day}
                        {#if day}
                            <div 
                                class="activity-cell aspect-square rounded-sm {getActivityClass(day)} hover:opacity-80 cursor-pointer"
                                title="{formatDate(day.date)}: {getActivityDescription(day)}"
                            >
                                {#if day.date.getDate() === 1}
                                    <div class="text-[8px] font-medium text-zinc-700 dark:text-zinc-300 leading-tight pl-0.5">
                                        {day.date.toLocaleDateString('it-IT', { month: 'short' })}
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <div class="activity-cell-empty aspect-square"></div>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
    
    
    <div class="activity-legend flex items-center gap-1 mt-3 justify-end">
        <span class="text-xs text-zinc-500 dark:text-zinc-400">Less</span>
        <div class="activity-level-0 size-3 rounded-sm"></div>
        <div class="activity-level-1 size-3 rounded-sm"></div>
        <div class="activity-level-2 size-3 rounded-sm"></div>
        <div class="activity-level-3 size-3 rounded-sm"></div>
        <div class="activity-level-4 size-3 rounded-sm"></div>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">More</span>
    </div>
</div>

<style>
    .activity-cell {
        position: relative;
        min-width: 12px;
        min-height: 12px;
    }
    
    .activity-cell-empty {
        background-color: transparent;
    }
    
    .activity-level-0 {
        background-color: rgb(243 244 246); /* bg-zinc-100 */
    }
    
    .activity-level-1 {
        background-color: rgb(191 219 254); /* bg-blue-200 */
    }
    
    .activity-level-2 {
        background-color: rgb(96 165 250); /* bg-blue-400 */
    }
    
    .activity-level-3 {
        background-color: rgb(37 99 235); /* bg-blue-600 */
    }
    
    .activity-level-4 {
        background-color: rgb(30 58 138); /* bg-blue-800 */
    }
    
    .dark .activity-level-0 {
        background-color: rgb(63 63 70); /* dark:bg-zinc-700 */
    }
    
    .dark .activity-level-1 {
        background-color: rgb(30 58 138); /* dark:bg-blue-900 */
    }
    
    .dark .activity-level-2 {
        background-color: rgb(37 99 235); /* dark:bg-blue-600 */
    }
    
    .dark .activity-level-3 {
        background-color: rgb(59 130 246); /* dark:bg-blue-500 */
    }
    
    .dark .activity-level-4 {
        background-color: rgb(96 165 250); /* dark:bg-blue-400 */
    }
</style>
