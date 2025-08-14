<script>
    import * as ls from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { contentStore } from '$lib/stores/content/content.js';
    import { page } from '$app/stores';

    let topic = $derived.by(() => {
        let pieces = $page.url.pathname.split('/');
        let levelIndex = pieces.indexOf('superiori');
        let subjectIndex = pieces.indexOf(pieces[levelIndex + 1]);
        let yearIndex = pieces.indexOf(pieces[subjectIndex + 1]);
        let topicIndex = pieces.indexOf(pieces[yearIndex + 1]);
        let topic = $contentStore.content.superiori[pieces[subjectIndex]][pieces[yearIndex]].topics[pieces[topicIndex]];

        topic.year = pieces[yearIndex];
        topic.subject = pieces[subjectIndex];
        topic.level = pieces[levelIndex];
        topic.key = pieces[topicIndex];

        return topic;
    })
    
    let subtopics = $derived(topic?.subtopics || {});
    let hasSubtopics = $derived(Object.keys(subtopics).length > 0);
</script>

<button 
    class="fixed top-24 left-8 flex items-center gap-2 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-lg text-zinc-800 dark:text-zinc-200 font-medium transition-colors"
    onclick={() => goto('/student/materiale')}
>
    <ls.ArrowLeft class="w-4 h-4" />
    Indietro
</button>

<div class="max-w-6xl mx-auto px-4 py-12 md:px-8">
    <div class="flex flex-col md:flex-row gap-8 mb-12">
        <div class="w-full md:w-1/3 lg:w-1/4 flex justify-center">
            <div class="relative w-64 h-64 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
                <img src={topic.icon} alt={topic.title} class="w-full h-full object-contain p-8" />
            </div>
        </div>

        <!-- Topic details -->
        <div class="w-full md:w-2/3 lg:w-3/4 space-y-6">
            <div>
                <h1 class="text-4xl font-bold mb-2 text-zinc-900 dark:text-white">{topic?.title}</h1>
                <div class="flex flex-row gap-2 items-center text-zinc-500 dark:text-zinc-400">
                    <span class="capitalize">{topic.level}</span>
                    <ls.ChevronRight class="w-4 h-4" />
                    <span class="capitalize">{topic?.subject?.replace('-', ' ')}</span>
                    <ls.ChevronRight class="w-4 h-4" />
                    <span class="capitalize">{topic?.year}° Anno</span>
                </div>
            </div>
            
            <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed">{topic?.description}</p>
            
            <div class="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-xl font-semibold flex items-center text-zinc-900 dark:text-zinc-100">
                        <ls.Brain class="w-5 h-5 mr-2 text-pink-600" />
                        Memory Bar
                    </h2>
                    <span class="text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full">
                        25%
                    </span>
                </div>
                <div class="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                    <div class="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full" style="width: 25%"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Subtopics section -->
    {#if hasSubtopics}
        <div class="mt-12">
            <h2 class="text-2xl font-bold mb-8 text-zinc-900 dark:text-white flex items-center">
                <ls.Layers class="w-6 h-6 mr-3 text-purple-600" />
                Argomenti
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each Object.entries(subtopics) as [key, subtopic]}
                    <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden hover:translate-y-[-4px] transition-transform">
                        <div class="h-3 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        <div class="p-6">
                            <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{subtopic.title}</h3>
                            <p class="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 mb-6">{subtopic.description}</p>
                            
                            <div class="flex space-x-3">
                                <button 
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    onclick={() => goto(`/student/materiale/${topic?.level}/${topic?.subject}/${topic?.year}/${topic?.key}/${key}/teoria`)}
                                >
                                    <ls.BookOpen class="w-4 h-4" />
                                    Teoria
                                </button>
                                <button 
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    onclick={() => goto(`/student/materiale/${topic?.level}/${topic?.subject}/${topic?.year}/${topic?.key}/${key}/esercizi`)}
                                >
                                    <ls.PenLine class="w-4 h-4" />
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
    <div class="mt-12 flex justify-between items-center">
        {#if !hasSubtopics}
            <div class="flex gap-4">
                <button 
                    class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    onclick={() => goto(`/student/materiale/${topic?.level}/${topic?.subject}/${topic?.year}/${topic?.key}/teoria`)}
                >
                    <ls.BookOpen class="w-4 h-4" />
                    Teoria
                </button>
                <button 
                    class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                    onclick={() => goto(`/student/materiale/${topic?.level}/${topic?.subject}/${topic?.year}/${topic?.key}/esercizi`)}
                >
                    <ls.PenLine class="w-4 h-4" />
                    Esercizi
                </button>
            </div>
        {/if}
    </div>
</div>