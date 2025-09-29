<script>
	import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
	import { searchStore } from '$lib/components/shared/ui/search.js';
	import { lecturesStore } from '$lib/stores/lectures.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { dataColumns } from '$lib/tables/subjects.svelte.js';
	import * as ls from 'lucide-svelte';

	import AddSubjectModal from '$lib/components/admin/subjects/AddSubjectModal.svelte';
	import EditSubjectModal from '$lib/components/admin/subjects/EditSubjectModal.svelte';
	import DeleteSubjectModal from '$lib/components/admin/subjects/DeleteSubjectModal.svelte';
	import Searchbar from '$lib/components/shared/ui/Searchbar.svelte';
	import Table from '$lib/components/admin/Table.svelte';

	let isAddSubjectModalOpen = $state(false);
	let isEditSubjectModalOpen = $state(false);
	let isDeleteSubjectModalOpen = $state(false);
	
	let selectedSubject = $state(null);

    let sortColumn = $state('name');
    let sortDirection = $state('asc');

	function openEditSubjectModal(subject) {
		selectedSubject = subject;
		isEditSubjectModalOpen = true;
	}

	function openDeleteSubjectModal(subject) {
		selectedSubject = subject;
		isDeleteSubjectModalOpen = true;
	}
	
    let filteredSubjects = $derived.by(() => {
        const allSubjects = $subjectsStore.subjects;
        if (!allSubjects) return [];
        if (!$searchStore.query) return allSubjects;

        const keys = ['name'];
        const filtered = allSubjects.filter(subject => 
            keys.some(key => String(subject[key])?.toLowerCase().includes($searchStore.query.toLowerCase()))
        );

        return filtered;
    });

    let title = $derived.by(() => {
        if (!$searchStore.query)
            return `Tutte le materie ${`(${filteredSubjects.length})`}`;

        if (filteredSubjects.length === 0)
            return 'Nessuna materia trovata';

        if (filteredSubjects.length === 1)
            return '1 materia trovata';

        return `${filteredSubjects.length} materie trovate`;
    });
</script>

<AddSubjectModal
	bind:isOpen={isAddSubjectModalOpen}
/>

<EditSubjectModal
	bind:isOpen={isEditSubjectModalOpen}
	bind:selectedSubject={selectedSubject}
/>

<DeleteSubjectModal
	bind:isOpen={isDeleteSubjectModalOpen}
	bind:selectedSubject={selectedSubject}
/>

<div class="flex justify-between items-center mb-6">
	<div class="flex flex-row items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
		<ls.BookOpen/>
		<span>{title}</span>
	</div>
	
	<div class="flex flex-row items-center gap-4">
		<a 
			href="/admin/materie/contenuto" 
			class="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-1.5 transition-colors"
		>
			<ls.LayoutGrid class="size-4" />
			Gestione Contenuti
		</a>
		<Searchbar placeholder="Cerca materia" classes="w-80"/>
		
		<button
			class="flex flex-row items-center whitespace-nowrap justify-center px-4 py-2 gap-2 text-sm font-medium transition-all duration-200 ease-in-out bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg border border-zinc-500/25"
			onclick={isAddSubjectModalOpen = true}
		>
			<ls.Plus class="size-5"/>
			<span>Nuova Materia</span>
		</button>
	</div>
</div>

<Table 
	data={filteredSubjects}
	columns={dataColumns}
	isLoading={$subjectsStore.isLoading}
	handleEditClick={openEditSubjectModal}
	handleDeleteClick={openDeleteSubjectModal}
	labelPlural="materie"
	labelSingular="materia"
/>

<!-- <div>
	<div class="bg-white dark:bg-zinc-900 shadow-sm rounded-lg overflow-x-auto">
        <table class="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead class="text-xs text-zinc-700 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400">
                <tr>
                    {#each columns as column}
                        <th scope="col" class="px-6 py-3 border-r border-zinc-200 dark:border-zinc-700">
                            <button 
                                class="flex items-center justify-between w-full hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                                onclick={() => column.sortable && handleSort(column.key)}
                            >
                                <span class="uppercase">{column.label}</span>
                                {#if column.sortable}
                                    <div class="flex flex-col ml-2">
                                        <ls.ChevronUp class="size-3 {sortColumn === column.key && sortDirection === 'asc' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}" />
                                        <ls.ChevronDown class="size-3 -mt-1 {sortColumn === column.key && sortDirection === 'desc' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}" />
                                    </div>
                                {/if}
                            </button>
                        </th>
                    {/each}
                    
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Azioni</span>
                    </th>
                </tr>
            </thead>
			<tbody>
				{#if $subjectsStore.isLoading}
					<tr>
						<td colspan="3" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
							Loading subjects...
						</td>
					</tr>
				{:else if sortedSubjects.length === 0}
					<tr>
						<td colspan="3" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
							No subjects found. Add your first subject to get started.
						</td>
					</tr>
				{:else}
					{#each sortedSubjects as subject (subject.id)}
                        {@const lecturesCount = $lecturesStore.lectures.filter(lecture => lecture.subject_id === subject.id).length}
						<tr class="bg-white dark:bg-zinc-900 border-t border-zinc-500/25 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
							<td class="px-4 py-2 font-medium text-zinc-900 dark:text-white whitespace-nowrap border-r border-zinc-200/50 dark:border-zinc-700/50">
                                <div class="flex items-center gap-3">
                                    <div class="size-3 rounded-full" style="background-color: {subject.hex_color};"></div>
                                    {subject.name}
                                </div>
							</td>
							<td class="px-4 py-2 text-right border-r border-zinc-200/50 dark:border-zinc-700/50">
								{lecturesCount}
							</td>
							<td class="flex items-center px-4 py-2 text-center justify-center gap-2">
                                <button 
                                    onclick={() => openEditSubjectModal(subject)}
                                    class="font-medium p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 dark:text-zinc-500"
                                    aria-label="Edit subject"
                                >
                                    <ls.Pencil size={16} />
                                </button>
                                <button 
                                    onclick={() => openDeleteSubjectModal(subject)}
                                    class="font-medium p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-700 text-red-600 hover:text-red-900 dark:text-red-500"
                                    aria-label="Delete subject"
                                >
                                    <ls.Trash size={16} />
                                </button>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div> -->