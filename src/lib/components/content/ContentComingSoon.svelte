<script lang="ts">
    import { 
        Hammer, Sparkles, CheckCircle2, ArrowRight,
        Dumbbell, Zap,
        Layers, Brain,
        Calculator, Sigma,
        ArrowLeft, BookOpen
    } from 'lucide-svelte';
    import { page } from '$app/stores';
    import NavigationButtons from './NavigationButtons.svelte';

    type ContentType = 'theory' | 'exercises' | 'flashcards' | 'formulary';

    let { 
        type = 'theory' as ContentType,
        title = undefined,
        description = undefined,
        buttonText = undefined,
        navigation = undefined
    } = $props();

    let hasRequestedContent = $state(false);

    const handleRequestContent = () => {
        hasRequestedContent = true;
    };

    let params = $derived($page.params);
    
    let chapterUrl = $derived(`/wiki/${params.level_id}/${params.subject_id}/${params.chapter_id}`);
    let theoryUrl = $derived(`/wiki/${params.level_id}/${params.subject_id}/${params.chapter_id}/${params.topic_id}/theory`);

    let backAction = $derived.by(() => {
        if (type === 'theory') {
            return {
                label: 'Torna al capitolo',
                url: chapterUrl,
                icon: ArrowLeft
            };
        } else {
            return {
                label: 'Torna alla teoria',
                url: theoryUrl,
                icon: BookOpen
            };
        }
    });

    const config = $derived.by(() => {
        switch (type) {
            case 'exercises':
                return {
                    title: 'Allenamento in costruzione',
                    description: 'Stiamo selezionando gli esercizi migliori per farti mettere in pratica quello che hai imparato. Un po\' di pazienza, stiamo caricando i pesi!',
                    buttonText: 'Mi servono esercizi!',
                    MainIcon: Dumbbell,
                    SecondaryIcon: Zap,
                    accentColor: 'text-emerald-500',
                    bgAccent: 'bg-emerald-100 dark:bg-emerald-900/20',
                    secondaryAccent: 'bg-yellow-100 dark:bg-yellow-900/30',
                    secondaryText: 'text-yellow-600 dark:text-yellow-400'
                };
            case 'flashcards':
                return {
                    title: 'Flashcards in arrivo',
                    description: 'Stiamo sintetizzando i concetti chiave per aiutarti a memorizzare tutto velocemente. Presto potrai ripassare in un lampo.',
                    buttonText: 'Voglio ripassare!',
                    MainIcon: Layers,
                    SecondaryIcon: Brain,
                    accentColor: 'text-violet-500',
                    bgAccent: 'bg-violet-100 dark:bg-violet-900/20',
                    secondaryAccent: 'bg-sky-100 dark:bg-sky-900/30',
                    secondaryText: 'text-sky-600 dark:text-sky-400'
                };
            case 'formulary':
                return {
                    title: 'Formulario in stesura',
                    description: 'Stiamo raccogliendo tutte le formule essenziali in un unico posto ordinato. Niente più foglietti volanti, promesso.',
                    buttonText: 'Mi serve il formulario!',
                    MainIcon: Calculator,
                    SecondaryIcon: Sigma,
                    accentColor: 'text-blue-500',
                    bgAccent: 'bg-blue-100 dark:bg-blue-900/20',
                    secondaryAccent: 'bg-orange-100 dark:bg-orange-900/30',
                    secondaryText: 'text-orange-600 dark:text-orange-400'
                };
            case 'theory':
            default:
                return {
                    title: 'Stiamo ancora scrivendo',
                    description: 'I nostri autori stanno preparando una lezione chiara e completa per questo argomento. Sapiens non si accontenta di spiegazioni a metà.',
                    buttonText: 'Mi serve questa lezione!',
                    MainIcon: Hammer,
                    SecondaryIcon: Sparkles,
                    accentColor: 'text-rose-500',
                    bgAccent: 'bg-rose-100 dark:bg-rose-900/20',
                    secondaryAccent: 'bg-amber-100 dark:bg-amber-900/30',
                    secondaryText: 'text-amber-600 dark:text-amber-400'
                };
        }
    });

    let displayTitle = $derived(title || config.title);
    let displayDescription = $derived(description || config.description);
    let displayButtonText = $derived(buttonText || config.buttonText);
</script>

<div class="h-full flex flex-col justify-between">
    <div class="flex flex-col flex-1 items-center justify-center max-w-lg mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="relative mb-8">
            <div class={`absolute inset-0 blur-2xl rounded-full opacity-50 transform -translate-y-2 ${config.bgAccent}`}></div>
            <div class="relative bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 p-5 rounded-2xl shadow-sm rotate-3 transition-transform hover:rotate-0 duration-500">
                <config.MainIcon class={`size-8 ${config.accentColor}`} />
            </div>
            <div class={`absolute -top-3 -right-3 p-2 rounded-xl border border-white/10 -rotate-6 shadow-sm ${config.secondaryAccent} ${config.secondaryText}`}>
                <config.SecondaryIcon class="size-4" />
            </div>
        </div>

        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
            {displayTitle}
        </h2>
        
        <p class="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-md mx-auto">
            {displayDescription}
        </p>

        <div class="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1 w-full max-w-sm mx-auto">
            {#if hasRequestedContent}
                <div class="flex items-center justify-center gap-2.5 py-3 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 animate-in zoom-in duration-300">
                    <CheckCircle2 class="size-5" />
                    <span class="font-medium">Messaggio ricevuto!</span>
                </div>
            {:else}
                <button 
                    onclick={handleRequestContent}
                    class="group w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-200 hover:shadow-sm"
                >
                    <span class="font-medium pl-1">{displayButtonText}</span>
                    <div class={`p-1.5 rounded-lg group-hover:scale-110 transition-transform ${config.bgAccent} ${config.accentColor}`}>
                        <ArrowRight class="size-4" />
                    </div>
                </button>
            {/if}
        </div>
        
        <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-4 font-medium">
            {#if hasRequestedContent}
                Daremo priorità a questo contenuto.
            {:else}
                Clicca per farci sapere che è urgente.
            {/if}
        </p>
    
    </div>
    
    <NavigationButtons navigation={navigation} />
</div>
