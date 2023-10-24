import { format } from 'date-fns';

export const extractingRoute = (path: string): string => {
  const parts = path.split("/");
  const lastPart = parts[parts.length - 1];
  const capitalized = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  return capitalized;
};

export const extractKeys = (arr: object[]): string[] => {
  const allKeys = new Set<string>();
  arr.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      allKeys.add(key);
    });
  });
  return Array.from(allKeys);
};



export function formatDate(date: Date | number, formatString = 'yyyy-MM-dd'): string {
  return format(date, formatString);
}

