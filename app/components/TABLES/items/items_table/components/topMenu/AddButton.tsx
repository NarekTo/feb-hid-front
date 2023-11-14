import { FC, useEffect, useRef, useState } from "react";

interface AddButtonProps {
  description: string;
  onclick: (option: string) => void;
  row: any; // Replace 'any' with the actual type of 'row'
}

export const AddButton: FC<AddButtonProps> = ({
  description,
  onclick,
  row,
}) => {
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
      className="bg-dark-blue text-white rounded-md px-4 py-1 text-xs cursor-pointer flex flex-col items-center justify-center"
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <p>{description}</p>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-6 left-1 mt-2 border border-primary-menu bg-white rounded shadow-lg z-50"
        >
          <div
            className="cursor-pointer py-2 px-4 hover:bg-gray-100 hover:rounded-t text-dark-blue"
            onClick={() => handleOptionClick("primary")}
          >
            Primary
          </div>
          <div
            className={`cursor-pointer py-2 px-4 hover:bg-gray-100 text-dark-blue ${
              !row && "opacity-50"
            }`}
            onClick={() => handleOptionClick("secondary")}
          >
            Secondary
          </div>
          <div
            className={`cursor-pointer py-2 px-4 hover:bg-gray-100 hover:rounded-b text-dark-blue ${
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
