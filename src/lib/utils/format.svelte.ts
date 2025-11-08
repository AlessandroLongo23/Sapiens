import { format as formatDate, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

export const formatCurrency = (amount: number, currency = 'EUR') => {
	return new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2
	}).format(amount);
};

export const formatDateDisplay = (date: string, formatStr = 'PP') => {
	if (!date) return '';
	const dateObj = typeof date === 'string' ? parseISO(date) : date;
	return formatDate(dateObj, formatStr, { locale: it });
};

export const formatHours = (hours: number) => {
	const hoursNumber: number = Math.floor(hours);
	const minutes: string = Math.floor(hours % 1 * 60).toString().padStart(2, '0');
	return `${hoursNumber}h ${minutes}m`;
}