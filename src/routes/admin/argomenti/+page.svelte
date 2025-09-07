<script>
	import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { subjectsStore } from '$lib/stores/subjects/subjects.js';
	import { subjectOptionsByLevel } from '$lib/data.js';
	import * as ls from 'lucide-svelte';

	import ColorPicker from '$lib/components/shared/ui/ColorPicker.svelte';
	import AddModal from '$lib/components/shared/ui/modals/AddModal.svelte';
	import EditModal from '$lib/components/shared/ui/modals/EditModal.svelte';
	import Searchbar from '$lib/components/shared/ui/Searchbar.svelte';
	import NewSubject from '$lib/components/shared/ui/buttons/NewSubject.svelte';

	let isAddSubjectOpen = $state(false);
	let isEditSubjectOpen = $state(false);
	let editingSubject = $state(null);
	let formData = $state({
		id: null,
		name: '',
		hex_color: '#3b82f6' 
	});
	
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	
    let sortColumn = $state('name');
    let sortDirection = $state('asc');

	function addSubject() {
		editingSubject = null;
		formData = {
			id: null,
			name: '',
			hex_color: '#3b82f6' 
		};
		isAddSubjectOpen = true;
	}
	
	function editSubject(subject) {
		editingSubject = subject;
		formData = { ...subject };
		isEditSubjectOpen = true;
	}
	
	function closeAddSubjectModal() {
		isAddSubjectOpen = false;
	}
	
	function closeEditSubjectModal() {
		isEditSubjectOpen = false;
	}

    function handleSort(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
    }
	
	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;
		errorMessage = '';
		
		try {
			if (editingSubject) {
				const { id, ...updates } = formData;
				await subjectsStore.updateSubject(id, updates);
                isEditSubjectOpen = false;
			} else {
				const { id, ...newSubject } = formData;
				await subjectsStore.addSubject(newSubject);
                isAddSubjectOpen = false;
			}

			messagePopup.success('Materia aggiornata con successo!');
		} catch (error) {
			errorMessage = error.message || 'An unknown error occurred';
		} finally {
			isSubmitting = false;
		}
	}
	
	async function deleteSubject(id) {
		if (!confirm('Are you sure you want to delete this subject?')) return;
		
		try {
			await subjectsStore.deleteSubject(id);
		} catch (error) {
			alert(error.message || 'An unknown error occurred');
		}
	}

    let sortedSubjects = $derived.by(() => {
        if (!$subjectsStore.subjects) return [];

        return [...$subjectsStore.subjects].sort((a, b) => {
            let aValue, bValue;

            if (sortColumn === 'lectures_count') {
                aValue = $lecturesStore.lectures.filter(lecture => lecture.subject_id === a.id).length;
                bValue = $lecturesStore.lectures.filter(lecture => lecture.subject_id === b.id).length;
            } else {
                aValue = a[sortColumn] || '';
                bValue = b[sortColumn] || '';
            }

            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();

            if (sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    });

	let search = $state('');

    const columns = [
        { label: 'Nome', key: 'name', sortable: true },
        { label: 'Lezioni', key: 'lectures_count', sortable: true },
		{ label: 'Livello', key: 'level', sortable: true }
    ];
</script>

<div>
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Materie</h1>
		
		<div class="flex flex-row items-center gap-4">
			<a 
				href="/admin/argomenti/contenuto" 
				class="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-1.5 transition-colors"
			>
				<ls.LayoutGrid class="size-4" />
				Gestione Contenuti
			</a>
			<Searchbar placeholder="Cerca materia" bind:value={search} classes="w-80"/>
			<NewSubject />
		</div>
	</div>
	
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
							<td class="px-4 py-2 text-right border-r border-zinc-200/50 dark:border-zinc-700/50">
								<!-- {Object.values(subjectOptionsByLevel).find(option => option.value === subject.level) || 'N/A'} -->
							</td>
							<td class="flex items-center px-4 py-2 text-center justify-center gap-2">
                                <button 
                                    onclick={() => editSubject(subject)}
                                    class="font-medium p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 dark:text-zinc-500"
                                    aria-label="Edit subject"
                                >
                                    <ls.Pencil size={16} />
                                </button>
                                <button 
                                    onclick={() => deleteSubject(subject.id)}
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
</div>

<EditModal 
	isOpen={isEditSubjectOpen} 
	onClose={closeEditSubjectModal}
	onSubmit={handleSubmit}
	title="Modifica Materia"
	subtitle="Gestione Materie"
	classes="max-w-xl bg-zinc-50 dark:bg-zinc-900 rounded-md"
>
	<form onsubmit={handleSubmit} class="p-4 space-y-4">
		<div class="flex flex-row gap-4 justify-between items-center">
			<div class="flex-1">
				<label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Nome Materia
				</label>
				<input 
					type="text" 
					id="name"
					bind:value={formData.name}
					class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
					required
				/>
			</div>
			
			<div>
				<label for="color" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Colore Materia
				</label>
				<ColorPicker 
					selectedColor={formData.hex_color}
					onColorSelect={(e) => formData.hex_color = e.hex}
				/>
			</div>
		</div>
		
		{#if errorMessage}
			<div class="text-red-500 text-sm">{errorMessage}</div>
		{/if}
	</form>
</EditModal> 