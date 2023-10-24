import { FC } from "react";
import Link from "next/link";

interface SubMenuItem {
  title: string;
  url: string;
}

interface MenuDropdownProps {
  submenus: SubMenuItem[];
}

const MenuDropdown: FC<MenuDropdownProps> = ({ submenus }) => {
  return (
    <ul className={`flex flex-col overflow-hidden`}>
      {submenus.map((submenu, index) => (
        <li key={index} className="">
          <Link href={submenu.url}>
            <p className="text-xs text-primary-menu font-medium bg-terciary-button p-2 my-2 rounded-lg">
              {submenu.title}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuDropdown;