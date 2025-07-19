import { format as formatDate, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
}

// Format date
function formatDateDisplay(date, formatStr = 'PP') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDate(dateObj, formatStr, { locale: it });
}

// Format time
function formatTime(timeString) {
  if (!timeString) return '';
  
  // Handle ISO time format or simple HH:MM format
  let hours, minutes;
  
  if (timeString.includes('T')) {
    // ISO datetime format
    const date = new Date(timeString);
    hours = date.getHours();
    minutes = date.getMinutes();
  } else {
    // Simple HH:MM format
    [hours, minutes] = timeString.split(':').map(Number);
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Format lecture duration
function formatDuration(startTime, endTime) {
  if (!startTime || !endTime) return '';
  
  // Parse times
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Calculate total minutes
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  let diffMinutes = endTotalMinutes - startTotalMinutes;
  
  // Handle negative duration (might happen if end time is on the next day)
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60; // Add one day worth of minutes
  }
  
  // Format as hours and minutes
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

// Calculate earnings from a lecture
function calculateEarnings(startTime, endTime, hourlyRate) {
  if (!startTime || !endTime || !hourlyRate) return 0;
  
  // Parse times
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Calculate duration in hours
  const startTotalHours = startHours + startMinutes / 60;
  const endTotalHours = endHours + endMinutes / 60;
  let durationHours = endTotalHours - startTotalHours;
  
  // Handle negative duration (might happen if end time is on the next day)
  if (durationHours < 0) {
    durationHours += 24;
  }
  
  return durationHours * hourlyRate;
}

export {
  formatCurrency,
  formatDateDisplay,
  formatTime,
  formatDuration,
  calculateEarnings
}; 