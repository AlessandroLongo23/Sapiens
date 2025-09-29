export class Lecture {
    constructor(lecture) {
        this.id = lecture.id;
        this.subject_id = lecture.subject_id;
        this.student_id = lecture.student_id;
        this.date = lecture.date;
        this.start_time = lecture.start_time;
        this.end_time = lecture.end_time;
        this.hourly_rate = lecture.hourly_rate;
        this.paid = lecture.paid;
        this.status = lecture.status;
    }

    getDuration(format = 'number') {
        const startTime = this.start_time.split(':');
        const endTime = this.end_time.split(':');
        const startHour = parseInt(startTime[0]);
        const endHour = parseInt(endTime[0]);
        const startMinutes = parseInt(startTime[1]);
        const endMinutes = parseInt(endTime[1]);
        const hours = endHour - startHour + (endMinutes - startMinutes) / 60;
        if (format === 'number') {
            return hours;
        } else if (format === 'string') {
            return hours.toHours();
        }
    }

    getEarning() {
        return this.getDuration() * this.hourly_rate;
    }
}