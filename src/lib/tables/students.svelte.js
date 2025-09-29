import { formatCurrency } from '$lib/utils/format.svelte.js';
import { lecturesStore } from '$lib/stores/lectures.js';
import { reviewsStore } from '$lib/stores/reviews.js';
import * as ls from 'lucide-svelte';

import ReviewTd from '$lib/components/admin/ReviewTd.svelte';

export const levels = [
    { label: 'Scuola Media', value: 'middle_school' },
    { label: 'Scuole Superiori', value: 'high_school' },
    { label: 'Università', value: 'university' },
    { label: 'Altro', value: 'altro' }
];

export const dataColumns = [
    {
        label: 'Nome',
        key: 'first_name',
        sortable: true,
        icon: ls.User,
        display: student => student.first_name
    },
    {
        label: 'Cognome',
        key: 'last_name',
        sortable: true,
        icon: ls.User,
        display: student => student.last_name
    },
    {
        label: 'Grado',
        key: 'level',
        sortable: true,
        icon: ls.GraduationCap,
        display: (student) => {
            let level = levels.find(level => level.value === student.level)?.label || 'N/A'
            let color;
            switch (student.level) {
                case 'middle_school':
                    color = 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 border';
                    break;
                case 'high_school':
                    color = 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200';
                    break;
                case 'university':
                    color = 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200';
                    break;
                case 'altro':
                    color = 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200';
                    break;
            }
            
            let component = `<span class="rounded-full px-2 py-1 ${color}">${level}</span>`;

            return component;
        }
    },
    {
        label: 'Città',
        key: 'city',
        sortable: true,
        icon: ls.MapPin,
        display: student => student.city || 'N/A'
    },
    {
        label: 'Lezioni',
        key: 'lectures_done',
        sortable: true,
        icon: ls.BookOpen,
        display: (student) => {
            let lecturesDone = 0;
            lecturesStore.subscribe(store =>  {
                lecturesDone = store.lectures.filter(lecture => lecture.student_id === student.id).length
            });

            return lecturesDone;
        },
        sort: (a, b, order) => {
            let lectures = [];
            lecturesStore.subscribe(store =>  {
                lectures = store.lectures
            });
            let aValue = lectures.filter(lecture => lecture.student_id === a.id).length;
            let bValue = lectures.filter(lecture => lecture.student_id === b.id).length;
            return order === 'asc' ? 
                aValue > bValue ? -1 : aValue < bValue ? 1 : 0 : 
                aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
    },
    {
        label: 'Guadagno',
        key: 'earnings',
        sortable: true,
        icon: ls.Euro,
        display: student => {
            let lectures = [];
            lecturesStore.subscribe(store =>  {
                lectures = store.lectures;
            });
            let earnings = lectures
                .filter(lecture => lecture.student_id === student.id)
                .reduce((acc, lecture) => {
                    const startTime = lecture.start_time.split(':');
                    const endTime = lecture.end_time.split(':');
                    const startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
                    const endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;
                    const hours = endHour - startHour;
                    const earnings = hours * (lecture.hourly_rate || 0);
                    
                    return acc + earnings;
                }, 0)
                .toFixed(2);

            earnings = parseFloat(earnings);
            student.earnings = earnings;
            return formatCurrency(earnings) || 'N/A';
        },
        sort: (a, b, order) => {
            return order === 'asc' ? 
                a.earnings > b.earnings ? -1 : a.earnings < b.earnings ? 1 : 0 : 
                a.earnings < b.earnings ? -1 : a.earnings > b.earnings ? 1 : 0;
        }
    },
    {
        label: 'Telefono',
        key: 'phone',
        sortable: false,
        icon: ls.Phone,
        display: student => student.phonePrefix + ' ' + student.phoneNumber || 'N/A',
        onclick: (student) => {
            let phone = student.phonePrefix.concat(student.phoneNumber).replace(/[^0-9]/g, '');
            window.open(`https://wa.me/${phone}`, '_blank');
        }
    },
    {
        label: '',
        key: 'review',
        sortable: true,
        icon: ls.MessageCircleMore,
        component: {
            is: ReviewTd,
            getProps: (client) => ({ studentId: client.id })
        },
        sort: (a, b, order) => {
            let reviews = [];
            reviewsStore.subscribe(store =>  {
                reviews = store.reviews
            });
            let aValue = reviews.filter(review => review.student_id === a.id).length;
            let bValue = reviews.filter(review => review.student_id === b.id).length;
            return order === 'asc' ? 
                aValue > bValue ? -1 : aValue < bValue ? 1 : 0 :
                aValue < bValue ? -1 : aValue > bValue ? 1 : 0; 
        }
    }
]