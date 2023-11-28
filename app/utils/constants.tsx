import { format } from "date-fns";
import { ProjectItems, ProjectProjects } from "../types";

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

export function formatDate(
  date: Date | number,
  formatString = "yyyy-MM-dd"
): string {
  return format(date, formatString);
}

export const filterActiveProjects = (projects: ProjectProjects[]) => {
  return projects.filter((project) => project.status_code === "JA");
};

// transform items to remove any white spaces
export const transformItems = (items: ProjectItems[]) => {
  return items.map((item) => {
    const newItem = { ...item };
    for (const key in newItem) {
      if (typeof newItem[key] === "string") {
        newItem[key] = newItem[key].trim();
      }
    }
    return newItem;
  });
};
