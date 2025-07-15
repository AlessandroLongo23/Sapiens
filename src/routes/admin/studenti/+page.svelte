<script>
    import { studentsStore } from '$lib/stores/students/students.js';
    import { searchStore } from '$lib/components/ui/search.js';
    import * as ls from 'lucide-svelte';
    
    import NewStudent from '$lib/components/buttons/NewStudent.svelte';
    import StudentsTable from '$lib/components/students/StudentsTable.svelte';
    import StudentsGrid from '$lib/components/students/StudentsGrid.svelte';
    import Searchbar from '$lib/components/ui/Searchbar.svelte';
    import ToggleButton from '$lib/components/ui/ToggleButton.svelte';
    
    let search = $state('');
    let view = $state('table');

    let filteredStudents = $derived.by(() => {
        let filtered = $studentsStore.students;

        if ($searchStore.query) {
            filtered = filtered.filter(student => 
                student.first_name?.toLowerCase().includes($searchStore.query.toLowerCase()) ||
                student.last_name?.toLowerCase().includes($searchStore.query.toLowerCase()) ||
                student.phone?.toLowerCase().includes($searchStore.query.toLowerCase()) ||
                student.level?.toLowerCase().includes($searchStore.query.toLowerCase()) ||
                student.city?.toLowerCase().includes($searchStore.query.toLowerCase())
            );
        }

        return filtered;
    });

    let title = $derived.by(() => {
        if (!$searchStore.query)
            return 'Tutti gli studenti';

        if (filteredStudents.length === 0)
            return 'Nessuno studente trovato';

        if (filteredStudents.length === 1)
            return '1 studente trovato';

        return `${filteredStudents.length} studenti trovati`;
})
</script>

<div class="flex flex-col gap-8">
    <div class="flex flex-row items-center justify-between gap-4 w-full">
        <h1 class="text-2xl font-bold">{title}</h1>

        <div class="flex flex-row items-center gap-4">
            <Searchbar placeholder="Cerca studente" bind:value={search} classes="w-80"/>
            <ToggleButton
                bind:value={view}
                type="icon"
                options={['table', 'grid']}
                icons={[ls.TableProperties, ls.LayoutGrid]}
                onchange={() => {
                    console.log('view changed to:', view);
                }}
            />
            <NewStudent />
        </div>
    </div>
    
    {#if view === 'table'}
        <StudentsTable students={filteredStudents} />
    {:else if view === 'grid'}
        <StudentsGrid students={filteredStudents} />
    {/if}
</div>