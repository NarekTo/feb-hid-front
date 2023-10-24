import { FC, ReactElement } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { HiOutlineCurrencyEuro } from "react-icons/hi";
import { FaRegBuilding, FaListUl, FaRegBell } from "react-icons/fa";
import { TbFileCertificate, TbReportAnalytics } from "react-icons/tb";
import { LuShip, LuFactory } from "react-icons/lu";
import { BsGear, BsQuestionCircle } from "react-icons/bs";

interface MenuItem {
  title: string;
  url: string;
  icon: ReactElement;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  url: string;
}


// Function to filter menu items
export const menuItemsFiltered = (isItemsPage: boolean, job: string, project: string): MenuItem[] => {
  const items: MenuItem[] = [
    {
      title: "Dashboard",
      url: "/",
      icon: <GiHamburgerMenu className="text-white" size={20} />,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <TbFileCertificate className="text-white" size={20} />,
      submenu: [
        {
          title: "List",
          url: "/projects/project-list",
        },
        {
          title: "Exchange Rate",
          url: "/projects/project-exchange-rate",
        },
        {
          title: "Authorization",
          url: "/projects/project-authorization",
        },
        {
          title: "Attributes",
          url: "/projects/project-attributes",
        },
      ],
    },
    {
      title: "Items",
      url: "/items",
      icon: <FaListUl className="text-white" size={20} />,
      submenu: [
        {
          title: "Room types",
          url: "/items/room-types",
        },
        {
          title: "Locations",
          url: "/items/locations",
        },
        {
          title: "Batches",
          url: `/items/batches?job_id=${job}&project_name=${project}`
        },
        {
          title: "Import",
          url: "/items/import",
        },
        {
          title: "Copy Items",
          url: "/items/copy-items",
        },
        {
          title: "Reports",
          url: "/items/reports",
        },
        {
          title: "Alerts",
          url: "/items/alerts",
        },
      ],
    },
    {
      title: "Orders",
      url: "/orders",
      icon: <FaRegBuilding className="text-white" size={20} />,
      submenu: [
        {
          title: "Interrogation",
          url: "/orders/interrogation",
        },
        ...(isItemsPage ? [
          {
            title: "Order Processing",
            url: "/orders/processing",
          },
          {
            title: "Labels",
            url: "/orders/labels",
          },
          {
            title: "Payment Request",
            url: "/orders/payment-request",
          },
        ] : [])
      ],
    },
    {
      title: "Logistics",
      url: "/logistics",
      icon: <LuShip className="text-white" size={20} />,
      submenu: [
        {
          title: "Deliveries",
          url: "/logistics/deliveries",
        },
        {
          title: "Shipping",
          url: "/logistics/shipping",
        },
        {
          title: "Invoice/Docs",
          url: "/logistics/invoices-docs",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: <TbReportAnalytics className="text-white" size={20} />,
    },
    {
      title: "Companies",
      url: "/companies",
      icon: <LuFactory className="text-white" size={20} />,
    },
    {
      title: "Currency",
      url: "/currency",
      icon: <HiOutlineCurrencyEuro className="text-white" size={20} />,
    },
    {
      title: "Admin",
      url: "/admin",
      icon: <BsGear className="text-white" size={20} />,
    },
    {
      title: "Help",
      url: "/help",
      icon: <BsQuestionCircle className="text-white" size={20} />,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: <CgProfile className="text-white" size={20} />,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: <FaRegBell className="text-white" size={20} />,
    },
  ];

  if (!isItemsPage) {
    return items.filter(item => isItemsPage || item.title !== 'Items');
  }

  return items;
};