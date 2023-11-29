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
    IB: "Item budgeting",
    ID: "Item Detailing",
    IDQ: "Item Tender Submitted",
    IDT: "Item Tender Received",
    IDS: "Item Submitted for Approval",
    IDR: "Item Rejected",
    IDA: "Item Approved",
    IXH: "Item not Required",
    IZ: "Item Deleted",
    IOP: "Item Order Preparation",
    IOR: "Item Order Submitted for Approval",
    IOA: "Item Approved for Issue to Supplier",
    IOI: "Item Order Issued to Supplier",
    IOF: "Item Order Finished",
    IOD: "Item Arrived at Delivery Dest.",
    ISP: "Item Shipment Preparation",
    ISS: "Item Shipment Sent",
    ISA: "Item Shipment Arrived",
    ISC: "Item Shipment Customs",
    ISH: "Item Shipment Held in Customs",
    IWJ: "Item Shipment Warehouse Jeddah",
    IWR: "Item Shipment Warehouse Riyadh",
    IZS: "Item Sent to Client",
    IZI: "Item Installation",
  };

  return statusMap[status] || "Unknown status";
};
