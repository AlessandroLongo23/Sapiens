import { lecturesStore } from '$lib/stores/lectures.js';
import { reviewsStore } from '$lib/stores/reviews.js';
import { Lecture } from '$lib/models/Lecture.svelte';
import { Review } from '$lib/models/Review.svelte';
import { User, GraduationCap, MapPin, BookOpen, Euro, Phone, MessageCircleMore } from 'lucide-svelte';
import { Level } from '$lib/models/Level.svelte';
import { formatCurrency } from '$lib/utils/format.svelte';
import { get } from 'svelte/store';

import ReviewTd from '$lib/components/admin/ReviewTd.svelte';

export class Student {
    id: string;
    first_name: string;
    last_name: string;
    city: string;
    email: string;
    phonePrefix: string;
    phoneNumber: string;
    level: Level;
    gender: string;
    assigned_topics: string[];

    constructor(student: any) {
        this.id = student.id;
        this.first_name = student.first_name;
        this.last_name = student.last_name;
        this.city = student.city;
        this.email = student.email;
        this.phonePrefix = student.phonePrefix;
        this.phoneNumber = student.phoneNumber;
        this.level = student.level;
        this.gender = student.gender;
        this.assigned_topics = student.assigned_topics;
    }

    public get lectures(): Lecture[] | undefined {
        const store = get(lecturesStore);
        return store.lectures.filter((lecture: Lecture) => lecture.student_id === this.id);
    }

    public get review(): Review | undefined {
        const store = get(reviewsStore);
        return store.reviews.find((review: Review) => review.student_id === this.id);
    }

    public getFullName(): string {
        return `${this.first_name} ${this.last_name}`;
    }

    public getPhone(): string {
        return `${this.phonePrefix} ${this.phoneNumber}`;
    }

    public getTotalEarnings(): number {
        return this.lectures.reduce(
            (acc: number, lecture: Lecture) => acc + lecture.getEarning(), 0
        );
    }

    public getTotalHours(): number {
        return this.lectures.reduce(
            (acc: number, lecture: Lecture) => acc + lecture.getDuration(), 0
        );
    }

    public static dataColumns: any[] = [
        {
            label: 'Nome',
            key: 'first_name',
            sortable: true,
            icon: User,
            display: (student: Student) => student.first_name
        },
        {
            label: 'Cognome',
            key: 'last_name',
            sortable: true,
            icon: User,
            display: (student: Student) => student.last_name
        },
        {
            label: 'Grado',
            key: 'level',
            sortable: true,
            icon: GraduationCap,
            display: (student: Student) => {
                let color: string = '';
                switch (student.level) {
                    case Level.MIDDLE_SCHOOL:
                        color = 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 border';
                        break;
                    case Level.HIGH_SCHOOL:
                        color = 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200';
                        break;
                    case Level.UNIVERSITY:
                        color = 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200';
                        break;
                    case Level.OTHER:
                        color = 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200';
                        break;
                }
                
                const component: string = `<span class="rounded-full px-2 py-1 ${color}">${student.level}</span>`;
    
                return component;
            }
        },
        {
            label: 'Città',
            key: 'city',
            sortable: true,
            icon: MapPin,
            display: (student: Student) => student.city || 'N/A'
        },
        {
            label: 'Lezioni',
            key: 'lectures_done',
            sortable: true,
            icon: BookOpen,
            display: (student: Student) => {
                return student.lectures?.length || 0;
            },
            sort: (a: any, b: any, order: string) => {
                let aValue: number = a.lectures?.length || 0;
                let bValue: number = b.lectures?.length || 0;
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
            display: (student: Student) => {
                return formatCurrency(student.getTotalEarnings() || 0) || 'N/A';
            },
            sort: (a: Student, b: Student, order: string) => {
                let aValue = a.getTotalEarnings() || 0;
                let bValue = b.getTotalEarnings() || 0;
                return order === 'asc' ? 
                    aValue > bValue ? -1 : aValue < bValue ? 1 : 0 : 
                    aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
        },
        {
            label: 'Telefono',
            key: 'phone',
            sortable: false,
            icon: Phone,
            display: (student: Student) => student.getPhone(),
            onclick: (student: Student) => {
                let phone = student.phonePrefix.concat(student.phoneNumber).replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${phone}`, '_blank');
            }
        },
        {
            label: '',
            key: 'review',
            sortable: true,
            icon: MessageCircleMore,
            component: {
                is: ReviewTd,
                getProps: (student: Student) => ({ student })
            },
            sort: (a: Student, b: Student, order: string) => {
                const aValue: boolean = a.review !== undefined;
                const bValue: boolean = b.review !== undefined;
                return order === 'asc' ? 
                    aValue > bValue ? -1 : aValue < bValue ? 1 : 0 :
                    aValue < bValue ? -1 : aValue > bValue ? 1 : 0; 
            }
        }
    ]
}
