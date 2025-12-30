import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(dateValue: string | number): Date {
  if (typeof dateValue === 'number') {
    return new Date(dateValue * 1000);
  }

  const numValue = Number(dateValue);
  if (!isNaN(numValue) && String(numValue) === dateValue) {
    return new Date(numValue * 1000);
  }

  return new Date(dateValue);
}

export function calculateDuration(
  startedAt: string | number,
  stoppedAt: string | number | null,
  currentTime?: Date
): number {
  const start = parseDate(startedAt);
  const end = stoppedAt ? parseDate(stoppedAt) : (currentTime || new Date());
  return end.getTime() - start.getTime();
}

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

export function calculateCost(durationMs: number, pricePerMinute: number): number {
  const totalMinutes = durationMs / 1000 / 60;
  return totalMinutes * pricePerMinute;
}

export function formatCost(cost: number): string {
  return cost.toFixed(2);
}

export function formatDate(dateValue: string | number): string {
  const date = parseDate(dateValue);

  if (isNaN(date.getTime())) {
    console.error('Invalid date value:', dateValue, 'type:', typeof dateValue);
    return 'Invalid Date';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
