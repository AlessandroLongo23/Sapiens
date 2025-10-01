import { lecturesStore } from '$lib/stores/lectures.js';

export class Student {
    constructor(student) {
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

    getFullName() {
        return `${this.first_name} ${this.last_name}`;
    }

    getPhone() {
        return `${this.phonePrefix} ${this.phoneNumber}`;
    }

    getEarning() {
        lecturesStore.subscribe(store => {
            return store.lectures
                .filter(lecture => lecture.student_id === this.id)
                .reduce((acc, lecture) => acc + lecture.getEarning(), 0);
        });
        return 0;
    }
}
