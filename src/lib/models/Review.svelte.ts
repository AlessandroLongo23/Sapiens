import { studentsStore } from '$lib/stores/students.js';
import { Student } from '$lib/models/Student.svelte';
import { get } from 'svelte/store';

export class Review {
    id: string;
    student_id: string;
    rating: number;
    review: string;

    constructor(review: any) {
        this.id = review.id;
        this.student_id = review.student_id;
        this.rating = review.rating;
        this.review = review.review;
    }

    public get student(): Student | undefined {
        const store = get(studentsStore);
        return store.students.find((student: Student) => student.id === this.student_id);
    }
}

export type ReviewRating = {
    [key: number]: string;
}

export const ReviewRatings: ReviewRating = {
    1: 'Da migliorare',
    2: 'Sufficiente',
    3: 'Buono',
    4: 'Molto buono',
    5: 'Eccellente',
}