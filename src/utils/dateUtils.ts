
import { format } from 'date-fns';

/**
 * Filter an array of objects by a specific date field and month/year
 */
export function filterByMonth<T>(
  items: T[],
  dateField: keyof T,
  year: number,
  month: number
): T[] {
  return items.filter(item => {
    const dateValue = item[dateField];
    if (!dateValue) return false;
    
    const date = new Date(dateValue as string);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

/**
 * Generate an array of month options for dropdowns
 */
export function generateMonthOptions(locale: string = 'en-US'): { label: string; value: string }[] {
  const options = [];
  const today = new Date();
  
  // Generate options for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const label = date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    const value = `${year}-${month}`;
    
    options.push({ label, value });
  }
  
  return options;
}

/**
 * Get a formatted month-year string
 */
export function getMonthYearString(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

/**
 * Format a date string according to locale
 */
export function formatDate(dateStr: string, locale: string = 'en-US'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
}
