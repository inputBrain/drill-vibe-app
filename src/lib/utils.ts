import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse date - handles both ISO strings and Unix timestamps (seconds)
 */
export function parseDate(dateValue: string | number): Date {
  // If it's a number (Unix timestamp in seconds)
  if (typeof dateValue === 'number') {
    return new Date(dateValue * 1000); // Convert seconds to milliseconds
  }

  // If it's a string that looks like a number (Unix timestamp as string)
  const numValue = Number(dateValue);
  if (!isNaN(numValue) && String(numValue) === dateValue) {
    return new Date(numValue * 1000);
  }

  // Otherwise treat as ISO string
  return new Date(dateValue);
}

/**
 * Calculate duration between two dates in milliseconds
 * @param currentTime - Optional current time for real-time calculations (for active sessions)
 */
export function calculateDuration(
  startedAt: string | number,
  stoppedAt: string | number | null,
  currentTime?: Date
): number {
  const start = parseDate(startedAt);
  const end = stoppedAt ? parseDate(stoppedAt) : (currentTime || new Date());
  return end.getTime() - start.getTime();
}

/**
 * Format duration in milliseconds to human-readable format
 * - < 1 min: "45s"
 * - < 1 hour: "5m 23s"
 * - >= 1 hour: "2h 15m 45s"
 */
export function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (totalSeconds < 60) {
    return `${seconds}s`;
  } else if (totalSeconds < 3600) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}

/**
 * Calculate cost based on duration and price per minute
 */
export function calculateCost(durationMs: number, pricePerMinute: number): number {
  const totalMinutes = durationMs / 1000 / 60;
  return totalMinutes * pricePerMinute;
}

/**
 * Format cost to 2 decimal places
 */
export function formatCost(cost: number): string {
  return cost.toFixed(2);
}

/**
 * Format date to local format
 */
export function formatDate(dateValue: string | number): string {
  const date = parseDate(dateValue);

  // Debug: log if date is invalid
  if (isNaN(date.getTime())) {
    console.error('Invalid date value:', dateValue, 'type:', typeof dateValue);
    return 'Invalid Date';
  }

  // Format: DD.MM.YYYY HH:MM
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
