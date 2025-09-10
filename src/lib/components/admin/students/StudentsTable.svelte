<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { studentsStore } from '$lib/stores/students/students.js';
    import { lecturesStore } from '$lib/stores/lectures/lectures.js';
    import { levels } from '$lib/stores/students/students.js';
    import { cardStyle } from '$lib/stores/appearance.js';
    import { goto } from '$app/navigation';
    import * as ls from 'lucide-svelte';

    import EditStudentModal from '$lib/components/admin/students/EditStudentModal.svelte';
    import DeleteStudentModal from '$lib/components/admin/students/DeleteStudentModal.svelte';
    
    let { students } = $props();

    let showEditModal = $state(false);
    let showDeleteModal = $state(false);
    let selectedStudent = $state(null);

    let sortColumn = $state('');
    let sortDirection = $state('asc');

    let editedStudent = $state({
        id: '',
        first_name: '',
        last_name: '',
        level: '',
        city: '',
        phone: ''
    });

    function handleSort(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
    }

    function getSortedStudents(students) {
        if (!sortColumn) return students;
        
        return [...students].sort((a, b) => {
            let aValue = a[sortColumn] || '';
            let bValue = b[sortColumn] || '';
            
            if (sortColumn === 'lectures_done') {
                aValue = $lecturesStore.lectures.filter(lecture => lecture.student_id === a.id).length;
                bValue = $lecturesStore.lectures.filter(lecture => lecture.student_id === b.id).length;
            } else {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }
            
            if (sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }

    function handleEditClick(e, student) {
        e.stopPropagation();

        selectedStudent = student;
        editedStudent = { ...student };
        showEditModal = true;
    }

    function handleDeleteClick(e, student) {
        e.stopPropagation();

        selectedStudent = student;
        showDeleteModal = true;
    }

    let sortedStudents = $derived.by(() => {
        if (students.length === 0) return [];
        return getSortedStudents(students);
    });

    
    //     e.stopPropagation();

    //     selectedStudent = student;

    //     isLocked = student.is_locked;

    //     if (!selectedStudent) return;
    //     try {
    //         const updated = await updateStudent(selectedStudent.id, editedStudent);
            
    //         const studentToUpdateInStore = { ...selectedStudent, ...updated };
    //         studentsStore.updateStudent(selectedStudent.id, studentToUpdateInStore);

    //         messagePopup.success('Studente bloccato con successo!');
    //         showEditModal = false;
    //         selectedStudent = null;
    //     } catch (error) {
    //         console.error('Error updating student:', error);
    //         messagePopup.error("Errore durante l'aggiornamento.");
    //     }
    // }

    let columns = $state([
        {
            label: 'Nome',
            key: 'first_name',
            sortable: true
        },
        {
            label: 'Cognome',
            key: 'last_name',
            sortable: true
        },
        {
            label: 'Grado',
            key: 'level',
            sortable: true
        },
        {
            label: 'Città',
            key: 'city',
            sortable: true
        },
        {
            label: 'Lezioni',
            key: 'lectures_done',
            sortable: true
        },
        {
            label: 'Telefono',
            key: 'phone',
            sortable: false
        },
    ])
</script>

<div class={`shadow-sm overflow-x-auto ${cardStyle}`}>
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
            {#each sortedStudents as student (student.id)}
                {@const lecturesDone = $lecturesStore.lectures.filter(lecture => lecture.student_id === student.id).length}
                <tr 
                    onclick={() => goto(`/admin/studenti/${student.id}`)}
                    class="cursor-pointer bg-white dark:bg-zinc-900 border-t border-zinc-500/25 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                    <td class="px-4 py-2 font-medium text-zinc-900 dark:text-white whitespace-nowrap border-r border-zinc-200/50 dark:border-zinc-700/50">{student.first_name}</td>
                    <td class="px-4 py-2 border-r border-zinc-200/50 dark:border-zinc-700/50">{student.last_name}</td>
                    <td class="px-4 py-2 border-r border-zinc-200/50 dark:border-zinc-700/50">{levels.find(level => level.value === student.level)?.label || 'N/A'}</td>
                    <td class="px-4 py-2 border-r border-zinc-200/50 dark:border-zinc-700/50">{student.city || 'N/A'}</td>
                    <td class="px-4 py-2 border-r border-zinc-200/50 dark:border-zinc-700/50 text-right">{lecturesDone}</td>
                    <td class="px-4 py-2 border-r border-zinc-200/50 dark:border-zinc-700/50">{student.phone || 'N/A'}</td>
                    <td class="flex items-center px-4 py-2 text-center justify-center gap-2">
                        <button onclick={(e) => handleEditClick(e, student)} class="font-medium p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 hover:underline">
                            <ls.Pencil class="size-4" />
                        </button>
                        <button onclick={(e) => handleLockClick(e, student)} class="font-medium p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 hover:underline">
                            {#if student.is_locked}
                                <ls.Lock class="text-red-500 size-4" />
                            {:else}
                                <ls.LockOpen class="size-4" />
                            {/if}
                        </button>
                        <button onclick={(e) => handleDeleteClick(e, student)} class="font-medium p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-700 text-red-600 hover:text-red-900 dark:text-red-500 hover:underline">
                            <ls.Trash2 class="size-4" />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>


<EditStudentModal   
    bind:isOpen={showEditModal}
    bind:editedStudent={editedStudent}
    bind:selectedStudent={selectedStudent}
/>

<DeleteStudentModal 
    bind:isOpen={showDeleteModal}
    bind:selectedStudent={selectedStudent}
/>