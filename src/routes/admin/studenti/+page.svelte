<script>
    import { studentsStore } from '$lib/stores/students.js';
    import { searchStore } from '$lib/components/shared/ui/search.js';
    import * as ls from 'lucide-svelte';

    import AddStudentModal from '$lib/components/admin/students/AddStudentModal.svelte';
    import StudentsTable from '$lib/components/admin/students/StudentsTable.svelte';
    import StudentsGrid from '$lib/components/admin/students/StudentsGrid.svelte';
    import ToggleButton from '$lib/components/shared/ui/ToggleButton.svelte';
    import Searchbar from '$lib/components/shared/ui/Searchbar.svelte';
    
    let search = $state('');
    let view = $state('table');
    let isAddNewStudentModalOpen = $state(false);

    let filteredStudents = $derived.by(() => {
        let filtered = $studentsStore.students;

        if ($searchStore.query) {
            filtered = filtered.filter(student => 
                student.first_name?.toLowerCase().includes($searchStore.query.toLowerCase()) ||
                student.last_name?.toLowerCase().includes($searchStore.query.toLowerCase()) ||
                student.phonePrefix?.concat(student.phoneNumber)?.toLowerCase().includes($searchStore.query.toLowerCase()) ||
                student.level?.toLowerCase().includes($searchStore.query.toLowerCase()) ||
                student.city?.toLowerCase().includes($searchStore.query.toLowerCase())
            );
        }

        return filtered;
    });

    let title = $derived.by(() => {
        if (!$searchStore.query)
            return `Tutti gli studenti ${`(${filteredStudents.length})`}`;

        if (filteredStudents.length === 0)
            return 'Nessuno studente trovato';

        if (filteredStudents.length === 1)
            return '1 studente trovato';

        return `${filteredStudents.length} studenti trovati`;
})
</script>

<AddStudentModal
    bind:isOpen={isAddNewStudentModalOpen}
    onClose={() => isAddNewStudentModalOpen = false}
/>

<div class="flex flex-col gap-8">
    <div class="flex flex-row items-center justify-between gap-4 w-full">
        <div class="flex flex-row items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            <ls.Users/>
            <span>{title}</span>
        </div>

        <div class="flex flex-row items-center gap-4">
            <Searchbar placeholder="Cerca studente" bind:value={search} classes="w-80"/>
            <ToggleButton
                bind:value={view}
                type="icon"
                options={['table', 'grid']}
                icons={[ls.TableProperties, ls.LayoutGrid]}
            />
            
            <button
                class="flex flex-row items-center whitespace-nowrap justify-center px-4 py-2 gap-2 text-sm font-medium transition-all duration-200 ease-in-out bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg border border-zinc-500/25"
                onclick={() => isAddNewStudentModalOpen = true}
            >
                <ls.UserPlus class="size-5"/>
                <span class="text-zinc-900 dark:text-zinc-50">Nuovo studente</span>
            </button>
        </div>
    </div>
    
    {#if view === 'table'}
        <StudentsTable students={filteredStudents} />
    {:else if view === 'grid'}
        <StudentsGrid students={filteredStudents} />
    {/if}
</div>