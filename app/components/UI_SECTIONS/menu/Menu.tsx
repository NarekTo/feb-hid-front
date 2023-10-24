import { FC, useEffect, useRef, useState, ReactElement } from "react";
import Link from "next/link";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import AnimateHeight from "react-animate-height";
import MenuDropdown from "./MenuDropDown";

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

interface MenuProps {
  items: MenuItem[];
}

export const Menu: FC<MenuProps> = ({ items }) => {
    const [open, setOpen] = useState(true);
    const startingDrop = Array.from(items, () => false);
    const [dropdown, setDropdown] = useState(startingDrop);
    const menuRef = useRef<HTMLDivElement>(null);
  
    const modifyDropdown = (index: number) => {
      const dropdownCopy = dropdown.map((value, i) =>
        i === index ? !value : false
      );
      setDropdown(dropdownCopy);
    };
  
    const handleToggleMenu = () => {
      setOpen(!open);
      setDropdown(startingDrop);
    };
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setDropdown(startingDrop);
        }
      };
  
      window.addEventListener("click", handleClickOutside);
  
      return () => {
        window.removeEventListener("click", handleClickOutside);
      };
    }, [startingDrop]);
  
  
    return (
        <div
          ref={menuRef}
          className={`${
            !open ? "md:w-full" : "md:w-[9.5rem]"
          } transform transition-width ease-in-out duration-500 rounded-tr-md  bg-gradient-to-b from-dark-blue to-light-blue overflow-hidden  h-full`}
        >
          <div
            className={`w-full justify-center hidden  ${
              !open ? "md:justify-center pt-4" : "md:justify-end md:pr-4 md:pt-4"
            }   md:flex`}
          >
            {open ? (
              <IoMdArrowDropleftCircle
                className="text-white cursor-pointer"
                size={24}
                onClick={handleToggleMenu}
              />
            ) : (
              <IoMdArrowDroprightCircle
                className="text-white cursor-pointer"
                size={24}
                onClick={handleToggleMenu}
              />
            )}
          </div>
    
          <ul
            className={`h-full overflow-y-auto p-2 flex flex-col justify-start items-${
              open ? "start" : "center"
            }`}
          >
            {items.map((item, index) => (
              <li
                className="p-2 md:p-4 flex justify-center flex-col items-center "
                key={item.title}
              >
                {item.submenu ? (
                  <>
                    <button
                      aria-expanded={dropdown[index]}
                      aria-controls={`submenu-${index}`}
                      className="flex items-center "
                      onClick={() => modifyDropdown(index)}
                    >
                      {item.icon}
                      <p
                        className={`text-white text-sm hidden md:flex transform transition-all ease-in-out duration-500 ${
                          open ? "pl-2 opacity:100" : "pl-0 opacity-0"
                        }`}
                      >
                        {open && item.title}
                      </p>
                    </button>
    
                    <AnimateHeight
                      id={`submenu-${index}`}
                      duration={500}
                      height={dropdown[index] ? "auto" : 0}
                    >
                      <MenuDropdown submenus={item.submenu} />
                    </AnimateHeight>
                  </>
                ) : (
                  <Link href={item.url}>
                    <div className="flex items-center">
                      {item.icon}
                      <p
                      style={{color: 'white' }}
                        className={`text-white text-sm hidden md:flex transform transition-all ease-in-out duration-500 ${
                          open ? "pl-2 opacity:100" : "pl-0 opacity-0"
                        }`}
                      >
                        {open && item.title}
                      </p>
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    };