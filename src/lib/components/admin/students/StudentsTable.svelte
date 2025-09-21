<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { studentsStore } from '$lib/stores/students.js';
    import { lecturesStore } from '$lib/stores/lectures.js';
    import { dataColumns, levels } from '$lib/models/students.svelte.js';
    import { cardStyle } from '$lib/const/appearance.js';
    import { goto } from '$app/navigation';
    import * as ls from 'lucide-svelte';

    import EditStudentModal from '$lib/components/admin/students/EditStudentModal.svelte';
    import DeleteStudentModal from '$lib/components/admin/students/DeleteStudentModal.svelte';
    import Table from '$lib/components/admin/Table.svelte';
    
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
</script>

<Table
    columns={dataColumns}
    data={sortedStudents}
    detailPageUrl="studenti"
    isLoading={$studentsStore.isLoading}
    handleEditClick={handleEditClick}
    handleDeleteClick={handleDeleteClick}
    labelPlural="studenti"
    labelSingular="studente"
/>


<EditStudentModal   
    bind:isOpen={showEditModal}
    bind:editedStudent={editedStudent}
    bind:selectedStudent={selectedStudent}
/>

<DeleteStudentModal 
    bind:isOpen={showDeleteModal}
    bind:selectedStudent={selectedStudent}
/>