import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';

export const calendarView = writable(new Date());
export const selectedDate = writable(new Date());
export const weekDays: string[] = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export function nextMonth(): void {
	calendarView.update((date: Date) => addMonths(date, 1));
}

export function prevMonth(): void {
	calendarView.update((date: Date) => subMonths(date, 1));
}

export function formatDateString(date: Date, formatString = 'PP'): string {
	return format(date, formatString, { locale: it });
}

export function isSelectedDate(date: Date): boolean {
	return isSameDay(date, get(selectedDate));
}

export function setSelectedDate(date: Date): void {
	selectedDate.set(date);
}

export const getMonthDays = (): { date: Date; isCurrentMonth: boolean }[] => {
	let currentMonth: Date;
	calendarView.subscribe((date: Date) => {
		currentMonth = date;
	})();
	
	const monthStart: Date = startOfMonth(currentMonth);
	const monthEnd: Date = endOfMonth(currentMonth);
	
	let startPadding: number = monthStart.getDay() - 1; 
	if (startPadding === -1) startPadding = 6; 
	
	const paddedStart: Date = subDays(monthStart, startPadding);
	const daysInMonth: Date[] = eachDayOfInterval({ start: monthStart, end: monthEnd });
	const totalCalendarDays: number = Math.ceil((daysInMonth.length + startPadding) / 7) * 7;
	const endPadding: number = totalCalendarDays - daysInMonth.length - startPadding;
	const paddedEnd: Date = addDays(monthEnd, endPadding);
	
	return eachDayOfInterval({ start: paddedStart, end: paddedEnd }).map((date: Date) => ({
		date,
		isCurrentMonth: date.getMonth() === currentMonth.getMonth()
	}));
}
