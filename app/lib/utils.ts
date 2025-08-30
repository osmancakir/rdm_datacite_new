import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hasAnyValue = (obj: any): boolean => {
  return Object.values(obj).some((value: any) => {
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    if (typeof value === 'object' && value !== null) {
      return hasAnyValue(value);
    }
    if (Array.isArray(value)) {
      return value.some((item: any) => hasAnyValue(item));
    }
    return value != null;
  });
};