<script lang="ts">
	import { Book, PenLine, Sigma, Zap, Check, X } from 'lucide-svelte';

	interface Props {
		title: string;
		path: string;
		hasTheory: boolean;
		hasFormulary: boolean;
		hasExercises: boolean;
		hasFlashcards: boolean;
	}

	let { title, path, hasTheory, hasFormulary, hasExercises, hasFlashcards }: Props = $props();

	const statusIcon = (has: boolean) => has ? Check : X;
	const statusColor = (has: boolean) => has 
		? 'text-emerald-500 bg-emerald-500/10' 
		: 'text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800';
</script>

<div class="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{title}</p>
		<p class="text-xs text-zinc-500 truncate">{path}</p>
	</div>
	
	<div class="flex items-center gap-1.5 shrink-0">
		<div class="p-1 rounded-md {statusColor(hasTheory)}" title="Teoria">
			<Book class="size-3" />
		</div>
		<div class="p-1 rounded-md {statusColor(hasExercises)}" title="Esercizi">
			<PenLine class="size-3" />
		</div>
		<div class="p-1 rounded-md {statusColor(hasFormulary)}" title="Formulario">
			<Sigma class="size-3" />
		</div>
		<div class="p-1 rounded-md {statusColor(hasFlashcards)} opacity-50" title="Flashcards (coming soon)">
			<Zap class="size-3" />
		</div>
	</div>
</div>

