import { subjectsStore } from '$lib/stores/subjects';
import { Subject } from '$lib/models/Subject.svelte';
import { studentsStore } from '$lib/stores/students';
import { Student } from '$lib/models/Student.svelte';
import { get } from 'svelte/store';

export class Lecture {
    id: string;
    student_id: string;
    subject_id: string;
    date: string;
    start_time: string;
    end_time: string;
    hourly_rate: number;
    paid: boolean;
    status: string;

    constructor(lecture: any) {
        this.id = lecture.id;
        this.student_id = lecture.student_id;
        this.subject_id = lecture.subject_id;
        this.date = lecture.date;
        this.start_time = lecture.start_time;
        this.end_time = lecture.end_time;
        this.hourly_rate = lecture.hourly_rate;
        this.paid = lecture.paid;
        this.status = lecture.status;
    }

    public get student(): Student | undefined {
        const store = get(studentsStore);
        return store.students?.find((student: Student) => student.id === this.student_id);
    }

    public get subject(): Subject | undefined {
        const store = get(subjectsStore);
        return store.subjects?.find((subject: Subject) => subject.id === this.subject_id);
    }

    public getDuration(): number {
        const startTime = this.start_time.split(':');
        const endTime = this.end_time.split(':');
        const startHour = parseInt(startTime[0]);
        const endHour = parseInt(endTime[0]);
        const startMinutes = parseInt(startTime[1]);
        const endMinutes = parseInt(endTime[1]);
        const hours = endHour - startHour + (endMinutes - startMinutes) / 60;
        return hours;
    }

    public getEarning(): number {
        return this.getDuration() * this.hourly_rate;
    }
}