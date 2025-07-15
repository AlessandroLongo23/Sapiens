import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, addDays, subDays } from 'date-fns';
import { writable } from 'svelte/store';

export const calendarView = writable(new Date());
export const selectedDate = writable(new Date());
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function nextMonth() {
	calendarView.update(date => addMonths(date, 1));
}

export function prevMonth() {
	calendarView.update(date => subMonths(date, 1));
}

export function formatDateString(date, formatString = 'PP') {
	return format(date, formatString);
}

export function isSelectedDate(date) {
	return isSameDay(date, selectedDate);
}

export function setSelectedDate(date) {
	selectedDate.set(date);
}

export const getMonthDays = () => {
	let currentMonth;
	
	calendarView.subscribe(date => {
		currentMonth = date;
	})();
	
	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(currentMonth);
	
	// Calculate days from previous month to include
	let startPadding = monthStart.getDay() - 1; // Monday is 1, Sunday is 0
	if (startPadding === -1) startPadding = 6; // If Sunday, make it 6
	
	const paddedStart = subDays(monthStart, startPadding);
	
	// Calculate days from next month to include to complete the grid
	const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
	const totalCalendarDays = Math.ceil((daysInMonth.length + startPadding) / 7) * 7;
	const endPadding = totalCalendarDays - daysInMonth.length - startPadding;
	
	const paddedEnd = addDays(monthEnd, endPadding);
	
	// Return all days with an isCurrentMonth flag
	return eachDayOfInterval({ start: paddedStart, end: paddedEnd }).map(date => ({
		date,
		isCurrentMonth: date.getMonth() === currentMonth.getMonth()
	}));
}
