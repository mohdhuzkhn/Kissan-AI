import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPkr(amount: number) {
  return `PKR ${amount.toLocaleString()}`;
}

export function formatPkrUr(amount: number) {
  return `${amount.toLocaleString()} روپے`;
}
