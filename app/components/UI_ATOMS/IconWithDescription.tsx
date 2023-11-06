import React, { useState, FC, ReactElement, useEffect, useRef } from "react";

interface IconWithDescriptionProps {
  icon: (props: { size: number; className: string }) => ReactElement;
  description: string;
  onclick?: () => void;
}

export const IconWithDescription: FC<IconWithDescriptionProps> = ({
  icon: Icon,
  description,
  onclick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center w-full h-auto "
      onClick={() => (onclick ? onclick() : null)}
    >
      <div
        className="border border-primary-menu rounded-md text-primary-menu cursor-pointer mr-1 bg-white m-1 shadow-lg hover:bg-white hover:shadow-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon size={20} className="" />
      </div>
      {isHovered && (
        <span className="bg-white font-thin px-1 text-primary-menu text-xs rounded absolute bottom-8 left-2 opacity-85 flex whitespace-nowrap z-60">
          {description}
        </span>
      )}
    </div>
  );
};

interface IconWithDescriptionDDProps {
  icon: (props: { size: number; className: string }) => ReactElement;
  description: string;
  onclick: (option: string) => void;
  row: any; // Replace 'any' with the actual type of 'row'
}

export const IconWithDescriptionDD: FC<IconWithDescriptionDDProps> = ({
  icon: Icon,
  description,
  onclick,
  row,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOptionClick = (option: string) => {
    if (option === "primary") {
      onclick(option);
      setShowDropdown(false);
    }
    if ((row && option === "secondary") || (row && option === "tertiary")) {
      onclick(option);
      setShowDropdown(false);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        handleOutsideClick(event);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div
      className="relative flex items-center w-full h-auto"
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <div
        className="border border-primary-menu rounded-md text-primary-menu cursor-pointer mr-1 bg-white m-1 shadow-lg hover:bg-white hover:shadow-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon size={20} className="" />
      </div>
      {isHovered && (
        <span className="bg-white font-thin px-1 text-primary-menu text-xs rounded absolute bottom-8 left-2 opacity-85 flex whitespace-nowrap z-60">
          {description}
        </span>
      )}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-6 left-1 mt-2 border border-primary-menu bg-white rounded shadow-lg z-50"
        >
          <div
            className="cursor-pointer py-2 px-4 hover:bg-gray-100 hover:rounded-t"
            onClick={() => handleOptionClick("primary")}
          >
            Primary
          </div>
          <div
            className={`cursor-pointer py-2 px-4 hover:bg-gray-100 ${
              !row && "opacity-50"
            }`}
            onClick={() => handleOptionClick("secondary")}
          >
            Secondary
          </div>
          <div
            className={`cursor-pointer py-2 px-4 hover:bg-gray-100 hover:rounded-b ${
              !row && "opacity-50"
            }`}
            onClick={() => handleOptionClick("tertiary")}
          >
            Tertiary
          </div>
        </div>
      )}
    </div>
  );
};
