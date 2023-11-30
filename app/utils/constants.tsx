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

// statuses for chart
export const getStatusName = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    IB: "I. budgeting",
    ID: "I. Detailing",
    IDQ: "I. Tender Submitted",
    IDT: "I. Tender Received",
    IDS: "I. Submitted Appr.",
    IDR: "I. Rejected",
    IDA: "I. Approved",
    IXH: "I. not Required",
    IZ: "I. Deleted",
    IOP: "I. Order Preparation",
    IOR: "I. Order Submitted Appr.",
    IOA: "I. Approved Issue",
    IOI: "I. Order Issued Supp.",
    IOF: "I. Order Finished",
    IOD: "I. Arrived Delivery Dest.",
    ISP: "I. Shipment Preparation",
    ISS: "I. Shipment Sent",
    ISA: "I. Shipment Arrived",
    ISC: "I. Shipment Customs",
    ISH: "I. Shipment Held Customs",
    IWJ: "I. Shipment WH Jeddah",
    IWR: "I. Shipment WH Riyadh",
    IZS: "I. Sent to Client",
    IZI: "I. Installation",
  };

  return statusMap[status] || "Unknown status";
};
