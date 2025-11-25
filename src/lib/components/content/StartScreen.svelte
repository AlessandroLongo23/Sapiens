<script lang="ts">
	import { fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
	import { Play, Clock, FileQuestion, Zap } from 'lucide-svelte';
    
    import Latex from '$lib/components/ui/Latex.svelte';

    type ExerciseType = "exercise" | "flashcard";

	let { 
		title, 
		description = "Mettiti alla prova con questi esercizi. Non preoccuparti se sbagli, sei qui per imparare!",
		questionCount, 
		estimatedTime = "5 min", 
		onStart,
        type = "exercise"
	} = $props<{
		title: string;
		description?: string;
		questionCount: number;
		estimatedTime?: string;
		onStart: () => void;
        type?: ExerciseType;
	}>();

    const typeConfig = {
        exercise: {
            icon: Zap,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            button: "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100",
            label: "Esercizi"
        },
        flashcard: {
            icon: Zap,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            button: "bg-blue-600 hover:bg-blue-700 text-white",
            label: "Flashcards"
        }
    };

    let config = $derived(typeConfig[type] || typeConfig.exercise);
    let Icon = $derived(config.icon);
</script>

<div class="flex flex-col items-center justify-center w-full h-full min-h-[60vh] p-6">
    <div 
        in:fly={{ y: 20, duration: 500, easing: cubicOut }}
        class="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden p-8 md:p-10 text-center"
    >
        
        <div class="mx-auto w-20 h-20 rounded-full {config.bg} flex items-center justify-center mb-6">
            <Icon class="w-10 h-10 {config.color}" strokeWidth={2.5} />
        </div>

        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
            <Latex content={title} />
        </h1>

        <p class="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            {description}
        </p>

        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="flex flex-col items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <FileQuestion class="w-5 h-5 text-zinc-400 mb-2" />
                <span class="text-xl font-bold text-zinc-900 dark:text-white">{questionCount}</span>
                <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Domande</span>
            </div>
            <div class="flex flex-col items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <Clock class="w-5 h-5 text-zinc-400 mb-2" />
                <span class="text-xl font-bold text-zinc-900 dark:text-white">{estimatedTime}</span>
                <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Tempo stimato</span>
            </div>
        </div>

        <button
            onclick={onStart}
            class="w-full py-4 px-6 rounded-xl font-semibold shadow-lg shadow-zinc-200 dark:shadow-none transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 {config.button}"
        >
            <Play class="w-5 h-5 fill-current" />
            <span>Inizia {config.label}</span>
        </button>
    </div>
</div>

