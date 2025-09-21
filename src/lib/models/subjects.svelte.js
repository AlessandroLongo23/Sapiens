import { lecturesStore } from '$lib/stores/lectures.js';
import { formatCurrency } from '$lib/utils/format.svelte.js';
import chroma from 'chroma-js';
import * as ls from 'lucide-svelte';

export const dataColumns = [
    {
        label: '',
        key: 'hex_color',
        sortable: true,
        icon: ls.Palette,
        display: subject => `<div class="w-4 h-4 rounded-full mx-auto" style="background-color: ${subject.hex_color}"></div>`,
        sort: (a, b, order) => {
            let hue1 = chroma(a.hex_color).get('hsl.h');
            let hue2 = chroma(b.hex_color).get('hsl.h');
            return order === 'asc' ? hue1 > hue2 ? 1 : hue1 < hue2 ? -1 : 0 : hue1 > hue2 ? -1 : hue1 < hue2 ? 1 : 0;
        },
        width: 'w-10',
    },
    {
        label: 'Nome',
        key: 'name',
        sortable: true,
        icon: ls.ALargeSmall,
        display: subject => subject.name
    },
    {
        label: 'Lezioni',
        key: 'lectures_count',
        sortable: true,
        icon: ls.BookOpen,
        display: (subject) => {
            let lecturesCount = 0;
            lecturesStore.subscribe(store =>  {
                lecturesCount = store.lectures.filter(lecture => lecture.subject_id === subject.id).length
            });

            return lecturesCount;
        }
    },
    {
        label: 'Guadagno',
        key: 'earnings',
        sortable: true,
        icon: ls.Euro,
        display: subject => {
            let lectures = [];
            lecturesStore.subscribe(store =>  {
                lectures = store.lectures;
            });
            let earnings = lectures
                .filter(lecture => lecture.subject_id === subject.id)
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
            subject.earnings = earnings;
            return formatCurrency(earnings) || 'N/A';
        },
        sort: (a, b, order) => {
            return order === 'asc' ? 
                a.earnings > b.earnings ? -1 : a.earnings < b.earnings ? 1 : 0 : 
                a.earnings < b.earnings ? -1 : a.earnings > b.earnings ? 1 : 0;
        }
    }
]