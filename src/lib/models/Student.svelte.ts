import { reviewsStore } from '$lib/stores/reviews.js';
import { Review } from '$lib/models/Review.svelte';
import { Level } from '$lib/models/Level.svelte';
import { get } from 'svelte/store';

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
}
