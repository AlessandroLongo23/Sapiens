import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { lecturesStore } from '$lib/stores/lectures.js';
import { subjectsStore } from '$lib/stores/subjects.js';
import { studentsStore } from '$lib/stores/students.js';
import { it } from 'date-fns/locale';
import { Lecture } from '$lib/models/Lecture.svelte';
import { Subject } from '$lib/models/Subject.svelte';
import { Student } from '$lib/models/Student.svelte';
import { designSystem } from '$lib/const/appearance';

export class StatsStore {
	lectures = $state<Lecture[]>([]);
	subjects = $state<Subject[]>([]);
	students = $state<Student[]>([]);
	filterType = $state<string>('all');
	filterId = $state<string | null>(null);
	timeRange = $state<number>(6);

	constructor() {
		lecturesStore.subscribe((data) => {
			this.lectures = data.lectures || [];
		});
		subjectsStore.subscribe((data) => {
			this.subjects = data.subjects || [];
		});
		studentsStore.subscribe((data) => {
			this.students = data.students || [];
		});
	}

	totalTime = $derived.by(() => {
		const total: number = this.lectures.reduce((total: number, lecture: Lecture) => {
			return total + lecture.getDuration();
		}, 0);

		return {
			hours: Math.floor(total),
			minutes: Math.round((total - Math.floor(total)) * 60)
		}
	});
	
	earningsByMonth = $derived.by(() => {
		const lectures = this.lectures;
		const timeRange = this.timeRange; 
		const filterType = this.filterType; 
		const filterId = this.filterId; 
		
		if (!lectures?.length) return [];
		
		const today = new Date();
		const startDate = startOfMonth(subMonths(today, timeRange - 1));
		const endDate = endOfMonth(today);
		
		const months = eachMonthOfInterval({ start: startDate, end: endDate });
		
		const earningsData = months.map((month: Date) => ({
			month: format(month, 'MMM yyyy', { locale: it }),
			earnings: 0,
			date: month
		}));
		
		lectures.forEach((lecture: Lecture) => {
			if (filterType === 'student' && lecture.student_id !== filterId) return;
			if (filterType === 'subject' && lecture.subject_id !== filterId) return;
			
			const lectureDate = parseISO(lecture.date);
			if (lectureDate >= startDate && lectureDate <= endDate) {
				const earnings = lecture.getEarning();
				
				const monthIndex = months.findIndex((month: Date) => 
					month.getMonth() === lectureDate.getMonth() && 
					month.getFullYear() === lectureDate.getFullYear()
				);
				
				if (monthIndex !== -1) {
					earningsData[monthIndex].earnings += earnings;
				}
			}
		});

		return earningsData;
	});

	totalEarnings = $derived.by(() => {
		return this.lectures.reduce((total: number, lecture: Lecture) => {
			return total + lecture.getEarning();
		}, 0).toFixed(2);
	});

	hoursByMonth = $derived.by(() => {
		const lectures = this.lectures;
		const timeRange = this.timeRange; 

		if (!lectures?.length) return [];
		
		const today = new Date();
		const startDate = startOfMonth(subMonths(today, timeRange - 1));
		const endDate = endOfMonth(today);

		const months = eachMonthOfInterval({ start: startDate, end: endDate });
		
		const hoursData = months.map((month: Date) => ({
			month: format(month, 'MMM yyyy', { locale: it }),
			hours: 0,
			date: month
		}));
		
		lectures.forEach((lecture: Lecture) => {
			const lectureDate = parseISO(lecture.date);
			if (lectureDate >= startDate && lectureDate <= endDate) {
				const hours: number = lecture.getDuration();
				
				const monthIndex = months.findIndex((month: Date) => 
					month.getMonth() === lectureDate.getMonth() && 
					month.getFullYear() === lectureDate.getFullYear()
				);
				
				if (monthIndex !== -1) {
					hoursData[monthIndex].hours += hours;
				}
			}
		});	

		return hoursData;
	});

	topEarnings = $derived.by(() => {
		if (!this.lectures?.length) return { bySubject: [], byStudent: [] };
		
		const bySubject = {};
		const byStudent = {};
		
		this.lectures.forEach((lecture: Lecture) => {
			const earnings: number = lecture.getEarning();
			const hours: number = lecture.getDuration();
			
			if (!bySubject[lecture.subject_id]) {
				const subject: Subject = this.subjects?.find((s: Subject) => s.id === lecture.subject_id);
				bySubject[lecture.subject_id] = {
					id: lecture.subject_id,
					name: subject?.name || 'Unknown Subject',
					totalEarnings: 0,
					color: subject?.hex_color || designSystem.colors.primary.green,
					hours: 0,
				};
			}
			bySubject[lecture.subject_id].totalEarnings += earnings;
			bySubject[lecture.subject_id].hours += hours;
			
			if (!byStudent[lecture.student_id]) {
				const student: Student = this.students?.find((s: Student) => s.id === lecture.student_id);
				byStudent[lecture.student_id] = {
					id: lecture.student_id,
					name: student?.getFullName() || 'Unknown Student',
					totalEarnings: 0,
					color: designSystem.colors.primary.green,
					hours: 0
				};
			}
			byStudent[lecture.student_id].totalEarnings += earnings;
			byStudent[lecture.student_id].hours += hours;
		});
		
		const subjectArray = Object.values(bySubject)
			.sort((a: any, b: any) => b.totalEarnings - a.totalEarnings)
			.slice(0, 5);
			
		const studentArray = Object.values(byStudent)
			.sort((a: any, b: any) => b.totalEarnings - a.totalEarnings)
			.slice(0, 5);
		
		return { bySubject: subjectArray, byStudent: studentArray };
	});
	
	setFilter(type: string, id: string | null = null) {
		this.filterType = type;
		this.filterId = id;
	}
	
	setTimeRange(months: number) {
		this.timeRange = months;
	}
}

export const statsStore = new StatsStore(); 