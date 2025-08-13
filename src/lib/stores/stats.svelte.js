import { lecturesStore } from '$lib/stores/lectures/lectures.js';
import { subjectsStore } from '$lib/stores/subjects/subjects.js';
import { studentsStore } from '$lib/stores/students/students.js';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';

class StatsStore {
	// Reactive inputs populated from external stores
	lectures = $state([]);
	subjects = $state([]);
	students = $state([]);
	filterType = $state('all');
	filterId = $state(null);
	timeRange = $state(6);

	constructor() {
		// Keep internal reactive state in sync with external stores
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
	
	earningsByMonth = $derived.by(() => {
		const lectures = this.lectures;
		const subjects = this.subjects;
		const students = this.students;
		const timeRange = this.timeRange; // track dependency
		const filterType = this.filterType; // track dependency
		const filterId = this.filterId; // track dependency
		
		if (!lectures?.length) return [];
		
		const today = new Date();
		const startDate = startOfMonth(subMonths(today, timeRange - 1));
		const endDate = endOfMonth(today);
		
		const months = eachMonthOfInterval({ start: startDate, end: endDate });
		
		const earningsData = months.map(month => ({
			month: format(month, 'MMM yyyy', { locale: it }),
			earnings: 0,
			date: month
		}));
		
		lectures.forEach(lecture => {
			if (filterType === 'student' && lecture.student_id !== filterId) return;
			if (filterType === 'subject' && lecture.subject_id !== filterId) return;
			
			const lectureDate = parseISO(lecture.date);
			if (lectureDate >= startDate && lectureDate <= endDate) {
				const startTime = lecture.start_time.split(':');
				const endTime = lecture.end_time.split(':');
				const startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
				const endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;
				const hours = endHour - startHour;
				
				const earnings = hours * (lecture.hourly_rate || 0);
				
				const monthIndex = months.findIndex(month => 
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

	hoursByMonth = $derived.by(() => {
		const lectures = this.lectures;
		const timeRange = this.timeRange; // track dependency

		if (!lectures?.length) return [];
		
		const today = new Date();
		const startDate = startOfMonth(subMonths(today, timeRange - 1));
		const endDate = endOfMonth(today);

		const months = eachMonthOfInterval({ start: startDate, end: endDate });
		
		const hoursData = months.map(month => ({
			month: format(month, 'MMM yyyy', { locale: it }),
			hours: 0,
			date: month
		}));
		
		lectures.forEach(lecture => {
			const lectureDate = parseISO(lecture.date);
			if (lectureDate >= startDate && lectureDate <= endDate) {
				const startTime = lecture.start_time.split(':');
				const endTime = lecture.end_time.split(':');
				const startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
				const endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;
				const hours = endHour - startHour;
				
				const monthIndex = months.findIndex(month => 
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
		const lectures = this.lectures;
		const subjects = this.subjects;
		const students = this.students;

		if (!lectures?.length) return { bySubject: [], byStudent: [] };
		
		const bySubject = {};
		const byStudent = {};
		
		lectures.forEach(lecture => {
			const startTime = lecture.start_time.split(':');
			const endTime = lecture.end_time.split(':');
			const startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
			const endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;
			const hours = endHour - startHour;
			
			const earnings = hours * (lecture.hourly_rate || 0);
			
			if (!bySubject[lecture.subject_id]) {
				const subject = subjects?.find(s => s.id === lecture.subject_id);
				bySubject[lecture.subject_id] = {
					id: lecture.subject_id,
					name: subject ? subject.name : 'Unknown Subject',
					totalEarnings: 0,
					hours: 0
				};
			}
			bySubject[lecture.subject_id].totalEarnings += earnings;
			bySubject[lecture.subject_id].hours += hours;
			
			if (!byStudent[lecture.student_id]) {
				const student = students.find(s => s.id === lecture.student_id);
				byStudent[lecture.student_id] = {
					id: lecture.student_id,
					name: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
					totalEarnings: 0,
					hours: 0
				};
			}
			byStudent[lecture.student_id].totalEarnings += earnings;
			byStudent[lecture.student_id].hours += hours;
		});
		
		const subjectArray = Object.values(bySubject)
			.sort((a, b) => b.totalEarnings - a.totalEarnings)
			.slice(0, 5);
			
		const studentArray = Object.values(byStudent)
			.sort((a, b) => b.totalEarnings - a.totalEarnings)
			.slice(0, 5);
		
		return { bySubject: subjectArray, byStudent: studentArray };
	});
	
	setFilter(type, id = null) {
		this.filterType = type;
		this.filterId = id;
	}
	
	setTimeRange(months) {
		this.timeRange = months;
	}
}

export const statsStore = new StatsStore(); 