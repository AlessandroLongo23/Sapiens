import { format as formatDate, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

export const formatCurrency = (amount) => {
	return new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 2
	}).format(amount);
};

export const formatDateDisplay = (date, formatStr = 'PP') => {
	if (!date) return '';
	const dateObj = typeof date === 'string' ? parseISO(date) : date;
	return formatDate(dateObj, formatStr, { locale: it });
};

export const formatTime = (timeString) => {
	if (!timeString) return '';
	
	let hours, minutes;
	
	if (timeString.includes('T')) {
		const date = new Date(timeString);
		hours = date.getHours();
		minutes = date.getMinutes();
	} else {
		[hours, minutes] = timeString.split(':').map(Number);
	}
	
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatDuration = (startTime, endTime) => {
	if (!startTime || !endTime) return '';
	
	const [startHours, startMinutes] = startTime.split(':').map(Number);
	const [endHours, endMinutes] = endTime.split(':').map(Number);
	
	const startTotalMinutes = startHours * 60 + startMinutes;
	const endTotalMinutes = endHours * 60 + endMinutes;
	let diffMinutes = endTotalMinutes - startTotalMinutes;
	
	if (diffMinutes < 0) {
		diffMinutes += 24 * 60;
	}
	
	const hours = Math.floor(diffMinutes / 60);
	const minutes = diffMinutes % 60;
	
	if (hours === 0) {
		return `${minutes}m`;
	} else if (minutes === 0) {
		return `${hours}h`;
	} else {
		return `${hours}h ${minutes}m`;
	}
};

export const calculateEarnings = (startTime, endTime, hourlyRate) => {
	if (!startTime || !endTime || !hourlyRate) return 0;
	
	const [startHours, startMinutes] = startTime.split(':').map(Number);
	const [endHours, endMinutes] = endTime.split(':').map(Number);
	
	const startTotalHours = startHours + startMinutes / 60;
	const endTotalHours = endHours + endMinutes / 60;
	let durationHours = endTotalHours - startTotalHours;
	
	if (durationHours < 0) {
		durationHours += 24;
	}
	
	return durationHours * hourlyRate;
};