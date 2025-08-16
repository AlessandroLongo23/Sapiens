<script>
    import * as ls from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { contentStore } from '$lib/stores/content/content.js';
    import { page } from '$app/stores';

    let topic = $derived.by(() => {
        if (!$contentStore.flatNodes || $contentStore.flatNodes.length === 0) {
            return null;
        }
        
        let pieces = $page.url.pathname.split('/');
        let levelSlug = 'universita';
        let subjectSlug = pieces[pieces.indexOf('universita') + 1];
        let topicSlug = pieces[pieces.indexOf(subjectSlug) + 1];
        
        // Construct the path to find the topic node
        const path = [levelSlug, subjectSlug, topicSlug];
        
        // Find the topic node with this path
        let topicNode = $contentStore.flatNodes.find(node => 
            node.node_type === 'topic' && 
            node.path && 
            node.path.length === path.length && 
            node.path.every((segment, i) => segment === path[i])
        );
        
        if (!topicNode) {
            console.error('Topic not found:', path);
            return null;
        }
        
        // Find all subtopics for this topic
        const subtopicNodes = $contentStore.flatNodes
            .filter(node => 
                node.node_type === 'subtopic' && 
                node.parent_id === topicNode.id
            )
            .sort((a, b) => {
                const ai = a.child_index ?? Number.POSITIVE_INFINITY;
                const bi = b.child_index ?? Number.POSITIVE_INFINITY;
                if (ai !== bi) return ai - bi;
                return (a.title || a.slug || '').localeCompare(b.title || b.slug || '');
            });
        
        // Convert subtopics array to object with slug keys
        const subtopics = subtopicNodes.reduce((acc, node) => {
            acc[node.slug] = {
                id: node.id,
                title: node.title || '',
                description: node.description || '',
                icon: node.icon || ''
            };
            return acc;
        }, {});
        
        return {
            ...topicNode,
            subject: subjectSlug,
            level: levelSlug,
            key: topicSlug,
            subtopics: subtopics
        };
    })
    
    let subtopics = $derived(topic?.subtopics || {});
    let hasSubtopics = $derived(Object.keys(subtopics).length > 0);
</script>

<button 
    class="fixed top-16 sm:top-24 left-3 sm:left-8 flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-lg text-zinc-800 dark:text-zinc-200 font-medium transition-colors text-sm sm:text-base"
    onclick={() => goto('/student/materiale')}
>
    <ls.ArrowLeft class="w-3 h-3 sm:w-4 sm:h-4" />
    Indietro
</button>

<div class="max-w-6xl mx-auto px-6 sm:px-4 pt-16 pb-8 sm:py-12 md:px-8">
    <div class="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 sm:mb-12">
        <div class="w-full md:w-1/3 lg:w-1/4 flex justify-center">
            <div class="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden">
                <img src={topic.icon} alt={topic.title} class="w-full h-full object-contain p-6 sm:p-8" />
            </div>
        </div>

        <!-- Topic details -->
        <div class="w-full md:w-2/3 lg:w-3/4 space-y-4 sm:space-y-6">
            <div>
                <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-zinc-900 dark:text-white">{topic?.title}</h1>
                <div class="flex flex-row gap-1 sm:gap-2 items-center text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm overflow-x-auto no-scrollbar pb-1">
                    <span class="capitalize whitespace-nowrap">{topic.level}</span>
                    <ls.ChevronRight class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span class="capitalize whitespace-nowrap">{topic?.subject?.replace('-', ' ')}</span>
                </div>
            </div>
            
            <p class="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">{topic?.description}</p>
            
            <div class="bg-white dark:bg-zinc-800 rounded-xl p-4 sm:p-6 shadow-md">
                <div class="flex justify-between items-center mb-2 sm:mb-3">
                    <h2 class="text-base sm:text-xl font-semibold flex items-center text-zinc-900 dark:text-zinc-100">
                        <ls.Brain class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-pink-600" />
                        Memory Bar
                    </h2>
                    <span class="text-xs sm:text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        25%
                    </span>
                </div>
                <div class="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 sm:h-2.5">
                    <div class="bg-gradient-to-r from-blue-500 to-green-500 h-2 sm:h-2.5 rounded-full" style="width: 25%"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Subtopics section -->
    {#if hasSubtopics}
        <div class="mt-8 sm:mt-12">
            <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-zinc-900 dark:text-white flex items-center">
                <ls.Layers class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-600" />
                Argomenti
            </h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {#each Object.entries(subtopics) as [key, subtopic]}
                    <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-md sm:shadow-lg overflow-hidden hover:translate-y-[-4px] transition-transform">
                        <div class="flex flex-col justify-between p-4 sm:p-6 h-full">
                            <div class="flex flex-col gap-2">
                                <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1 sm:mb-2">{subtopic.title}</h3>
                                <p class="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 mb-4 sm:mb-6">{subtopic.description}</p>
                            </div>
                            
                            <div class="flex flex-row gap-2">
                                <button 
                                    class="flex w-1/2 items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    onclick={() => goto(`/student/materiale/${topic?.level}/${topic?.subject}/${topic?.key}/${key}/teoria`)}
                                >
                                    <ls.BookOpen class="w-3 h-3 sm:w-4 sm:h-4" />
                                    Teoria
                                </button>
                                <button 
                                    class="flex w-1/2 items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    onclick={() => goto(`/student/materiale/${topic?.level}/${topic?.subject}/${topic?.key}/${key}/esercizi`)}
                                >
                                    <ls.PenLine class="w-3 h-3 sm:w-4 sm:h-4" />
                                    Esercizi
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Actions section -->
    <div class="mt-8 sm:mt-12 flex justify-between items-center">
        {#if !hasSubtopics}
            <div class="flex flex-col xs:flex-row gap-2 xs:gap-4 w-full xs:w-auto">
                <button 
                    class="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    onclick={() => goto(`/student/materiale/${topic?.level}/${topic?.subject}/${topic?.key}/teoria`)}
                >
                    <ls.BookOpen class="w-3 h-3 sm:w-4 sm:h-4" />
                    Teoria
                </button>
                <button 
                    class="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    onclick={() => goto(`/student/materiale/${topic?.level}/${topic?.subject}/${topic?.key}/esercizi`)}
                >
                    <ls.PenLine class="w-3 h-3 sm:w-4 sm:h-4" />
                    Esercizi
                </button>
            </div>
        {/if}
    </div>
</div>