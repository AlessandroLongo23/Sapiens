import { Palette, BookOpen, Clock, Euro, ALargeSmall } from 'lucide-svelte';
import { formatHours, formatCurrency } from '$lib/utils/format.svelte';
import { lecturesStore } from '$lib/stores/lectures';
import { Lecture } from '$lib/models/Lecture.svelte';
import { get } from 'svelte/store';
import chroma from 'chroma-js';

export class Subject {
    id: string;
    name: string;
    hex_color: string;

    constructor(subject: any) {
        this.id = subject.id;
        this.name = subject.name;
        this.hex_color = subject.hex_color;
    }

    public get lectures(): Lecture[] | undefined {
        const store = get(lecturesStore);
        return store.lectures?.filter((lecture: Lecture) => lecture.subject_id === this.id);
    }

    public getTotalEarnings(): number {
        return this.lectures?.reduce((acc: number, lecture: Lecture) => {
            return acc + lecture.getEarning();
        }, 0);
    }

    public getTotalHours(): number {
        return this.lectures?.reduce((acc: number, lecture: Lecture) => {
            return acc + lecture.getDuration();
        }, 0);
    }

    public static dataColumns: any[] = [
        {
            label: '',
            key: 'hex_color',
            sortable: true,
            icon: Palette,
            display: (subject: Subject) => `<div class="w-4 h-4 rounded-full mx-auto" style="background-color: ${subject.hex_color}"></div>`,
            sort: (a: any, b: any, order: string) => {
                let hue1 = chroma(a.hex_color).get('hsl.h') as number;
                let hue2 = chroma(b.hex_color).get('hsl.h') as number;
                return order === 'asc' ? hue1 > hue2 ? 1 : hue1 < hue2 ? -1 : 0 : hue1 > hue2 ? -1 : hue1 < hue2 ? 1 : 0;
            },
            width: 'w-10',
        },
        {
            label: 'Nome',
            key: 'name',
            sortable: true,
            icon: ALargeSmall,
            display: (subject: Subject) => subject.name,
        },
        {
            label: 'Lezioni',
            key: 'lectures_count',
            sortable: true,
            icon: BookOpen,
            display: (subject: Subject) => subject.lectures?.length || 0,
            sort: (a: any, b: any, order: string) => {
                let aValue: number = a.lectures?.length || 0;
                let bValue: number = b.lectures?.length || 0;
                return order === 'asc' ? 
                    aValue > bValue ? -1 : aValue < bValue ? 1 : 0 : 
                    aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
        },
        {
            label: 'Ore',
            key: 'hours',
            sortable: true,
            icon: Clock,
            display: (subject: Subject) => formatHours(subject.getTotalHours() || 0),
            sort: (a: any, b: any, order: string) => {
                let aValue: number = a.getTotalHours() || 0;
                let bValue: number = b.getTotalHours() || 0;
                return order === 'asc' ? 
                    aValue > bValue ? -1 : aValue < bValue ? 1 : 0 : 
                    aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
        },
        {
            label: 'Guadagno',
            key: 'earnings',
            sortable: true,
            icon: Euro,
            display: (subject: Subject) => formatCurrency(subject.getTotalEarnings() || 0),
            sort: (a: any, b: any, order: string) => {
                let aValue: number = a.getTotalEarnings() || 0;
                let bValue: number = b.getTotalEarnings() || 0;
                return order === 'asc' ? 
                    aValue > bValue ? -1 : aValue < bValue ? 1 : 0 : 
                    aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
        }
    ]
}