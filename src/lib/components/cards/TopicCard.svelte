<script>
    import { goto } from '$app/navigation';
    import * as ls from 'lucide-svelte';
    import { selectedTopic } from '$lib/content.js';
    import MemoryBar from '../MemoryBar.svelte';
    
    let { title, description, icon, path, level, subject, year, key, subtopics } = $props();

    let memory = $state(Math.floor(Math.random() * 100));
    let color = $derived.by(() => {
        const hue = (memory / 100) * 120;
        return `hsl(${hue}, 90%, 45%)`;
    });

    let isHovered = $state(false);
    
    // Calculate subtopic count if available
    let hasSubtopics = $derived(subtopics && Object.keys(subtopics || {}).length > 0);
    let subtopicCount = $derived(hasSubtopics ? Object.keys(subtopics).length : 0);
</script>

<div 
    class="topic-card group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:shadow-lg transition-all duration-300"
    onmouseenter={() => isHovered = true}
    onmouseleave={() => isHovered = false}
    onclick={() => {
        setTimeout(() => {
            goto(`/student/materiale/${level}/${subject}/${year}/${key}/`);
        }, 100);
    }}
>
    <!-- Progress indicator -->
    <div class="absolute bottom-0 left-0 w-full h-1.5 bg-zinc-200 dark:bg-zinc-700">
        <div class="h-full transition-all duration-500 ease-out" style="background-color: {color}; width: {memory}%;"></div>
    </div>
    
    <!-- Card content -->
    <div class="flex flex-col h-48 p-4">
        <!-- Subject badge -->
        <div class="text-xs font-medium px-2.5 py-1 rounded-full w-fit {
            subject === 'matematica' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
            subject === 'informatica' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
            subject === 'fisica' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
            'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
        } mb-2.5 capitalize">
            {subject.replace('-', ' ')} {level === 'superiori' ? `${year}° anno` : ''}
        </div>
        
        <!-- Topic title -->
        <h3 class="text-lg font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-2">
            {title}
        </h3>
        
        <!-- Icon -->
        <div class="flex-1 flex items-center justify-center my-2 relative">
            <div class="w-20 h-20 flex items-center justify-center">
                {#if icon}
                    <img src={icon} alt={title} class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
                {:else}
                    <div class="text-zinc-400 dark:text-zinc-500 text-5xl">
                        <ls.BookOpen />
                    </div>
                {/if}
            </div>
            
            <!-- Floating details that appear on hover -->
            <div class="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-blue-800/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white rounded-md">
                <div class="text-center p-2">
                    {#if hasSubtopics}
                        <div class="font-bold text-2xl mb-1">{subtopicCount}</div>
                        <div class="text-sm font-medium">sottotemi</div>
                    {:else}
                        <ls.BookOpen class="h-8 w-8 mx-auto mb-1" />
                        <div class="text-sm font-medium">Visualizza</div>
                    {/if}
                </div>
            </div>
        </div>
        
        <!-- Progress stats -->
        <div class="flex justify-between items-center text-xs text-zinc-600 dark:text-zinc-400 mt-auto">
            <div>Memoria: {memory}%</div>
            <div>
                <ls.Clock class="w-3.5 h-3.5 inline-block mr-1" />
                <span>{Math.round(Math.random() * 20 + 5)} min</span>
            </div>
        </div>
    </div>
</div>

<style>
    .topic-card {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .topic-card:hover {
        transform: translateY(-4px);
    }

    .topic-card:active {
        transform: translateY(2px);
    }
</style>