<script>
	import { lecturesStore } from '$lib/stores/lectures.svelte.js';
	import { subjectsStore } from '$lib/stores/subjects.svelte.js';
	import { Plus, Pencil, Trash, X } from 'lucide-svelte';

	import ColorPicker from '$lib/components/ui/ColorPicker.svelte';
	import Modal from '$lib/components/modals/Modal.svelte';
	
	let isOpen = $state(false);
	let editingSubject = $state(null);
	let formData = $state({
		id: null,
		name: '',
		hex_color: '#3b82f6' // Default blue color
	});
	
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	
	function addSubject() {
		editingSubject = null;
		formData = {
			id: null,
			name: '',
			hex_color: '#3b82f6' // Default blue color
		};
		isOpen = true;
	}
	
	function editSubject(subject) {
		editingSubject = subject;
		formData = { ...subject };
		isOpen = true;
	}
	
	function handleColorSelect(hex_color) {
		formData.hex_color = hex_color;
	}
	
	function toggleModal() {
		isOpen = !isOpen;
	}
	
	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;
		errorMessage = '';
		
		try {
			if (editingSubject) {
				const { id, ...updates } = formData;
				const result = await subjectsStore.updateSubject(id, updates);
				if (result) {
					isOpen = false;
				} else {
					errorMessage = 'Failed to update subject';
				}
			} else {
				// Add new subject
				const { id, ...newSubject } = formData;
				const result = await subjectsStore.addSubject(newSubject);
				if (result) {
					isOpen = false;
				} else {
					errorMessage = 'Failed to add subject';
				}
			}
		} catch (error) {
			errorMessage = error.message || 'An unknown error occurred';
		} finally {
			isSubmitting = false;
		}
	}
	
	async function deleteSubject(id) {
		if (!confirm('Are you sure you want to delete this subject?')) return;
		
		try {
			const result = await subjectsStore.deleteSubject(id);
			if (!result) {
				alert('Failed to delete subject');
			}
		} catch (error) {
			alert(error.message || 'An unknown error occurred');
		}
	}
</script>

<div>
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Subjects</h1>
		
		<button 
			class="px-3 py-2 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
			onclick={addSubject}
		>
			<Plus size={18} />
			Add Subject
		</button>
	</div>
	
	<div class="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800 overflow-hidden">
		<table class="w-full">
			<thead>
				<tr class="border-b border-zinc-200 dark:border-zinc-800">
					<th class="px-4 w-6 border-r border-zinc-200 dark:border-zinc-800 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">#</th>
					<th class="px-4 w-6 border-r border-zinc-200 dark:border-zinc-800 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">Color</th>
					<th class="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">Subject Name</th>
					<th class="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50"># Lectures</th>
					<th class="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-50">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if subjectsStore.isLoading}
					<tr>
						<td colspan="3" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
							Loading subjects...
						</td>
					</tr>
				{:else if subjectsStore.subjects.length === 0}
					<tr>
						<td colspan="3" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
							No subjects found. Add your first subject to get started.
						</td>
					</tr>
				{:else}
					{#each subjectsStore.subjects as subject, index}
						<tr class="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
							<td class="px-4 w-6 border-r border-zinc-200 dark:border-zinc-800 py-3 text-zinc-600 dark:text-zinc-400">
								{index + 1}
							</td>
							<td class="px-4 py-3 border-r border-zinc-200 dark:border-zinc-800 text-center">
								<div class="flex justify-center items-center">
									<div class="size-4 rounded" style="background-color: {subject.hex_color};"></div>
								</div>
							</td>
							<td class="px-4 py-3 text-zinc-900 dark:text-zinc-100">
								{subject.name}
							</td>
							<td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">
								{lecturesStore.lectures.filter(lecture => lecture.subject_id === subject.id).length}
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex justify-end items-center space-x-2">
									<button 
										class="p-1 text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
										onclick={() => editSubject(subject)}
										aria-label="Edit subject"
									>
										<Pencil size={16} />
									</button>
									<button 
										class="p-1 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
										onclick={() => deleteSubject(subject.id)}
										aria-label="Delete subject"
									>
										<Trash size={16} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal isOpen={isOpen} onClose={toggleModal}>
	<div class="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
		<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
			{editingSubject ? 'Edit Subject' : 'Add Subject'}
		</h2>
		<button 
			class="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
			onclick={toggleModal}
			aria-label="Close"
		>
			<X size={20} />
		</button>
	</div>
	
	<form onsubmit={handleSubmit} class="p-4 space-y-4">
		<div class="flex flex-row gap-4 justify-between items-center">
			<div class="flex-1">
				<label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Subject Name
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
					Subject Color
				</label>
				<ColorPicker 
					selectedColor={formData.hex_color}
					onColorSelect={handleColorSelect}
				/>
			</div>
		</div>
		
		{#if errorMessage}
			<div class="text-red-500 text-sm">{errorMessage}</div>
		{/if}
		
		<div class="flex justify-end pt-2 space-x-2">
			<button
				type="button"
				class="px-4 py-2 bg-zinc-200 text-zinc-900 rounded hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
				onclick={toggleModal}
				disabled={isSubmitting}
			>
				Cancel
			</button>
			
			<button
				type="submit"
				class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
				disabled={isSubmitting}
			>
				{editingSubject ? 'Update' : 'Add'} Subject
			</button>
		</div>
	</form>
</Modal> 