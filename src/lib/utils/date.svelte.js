import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { writable } from 'svelte/store';

export const calendarView = writable(new Date());
export const selectedDate = writable(new Date());
export const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export function nextMonth() {
	calendarView.update(date => addMonths(date, 1));
}

export function prevMonth() {
	calendarView.update(date => subMonths(date, 1));
}

export function formatDateString(date, formatString = 'PP') {
	return format(date, formatString, { locale: it });
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
	
	
	let startPadding = monthStart.getDay() - 1; 
	if (startPadding === -1) startPadding = 6; 
	
	const paddedStart = subDays(monthStart, startPadding);
	
	
	const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
	const totalCalendarDays = Math.ceil((daysInMonth.length + startPadding) / 7) * 7;
	const endPadding = totalCalendarDays - daysInMonth.length - startPadding;
	
	const paddedEnd = addDays(monthEnd, endPadding);
	
	
	return eachDayOfInterval({ start: paddedStart, end: paddedEnd }).map(date => ({
		date,
		isCurrentMonth: date.getMonth() === currentMonth.getMonth()
	}));
}
