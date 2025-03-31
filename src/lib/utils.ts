
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format date
export function formatDate(date: string | Date): string {
  if (!date) return "";
  return format(new Date(date), 'dd/MM/yyyy');
}
