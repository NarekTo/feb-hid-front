import { ProjectItemsWithSelect } from "../../../../../types";

interface ContextMenuProps {
  top: number;
  left: number;
  onclick: (option: string) => void;
  row: ProjectItemsWithSelect; // Replace 'any' with the actual type of 'row'
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  top,
  left,
  onclick,
  row,
}) => {
  const handleOptionClick = (option: string) => {
    if (option === "primary") {
      onclick(option);
    }
    if ((row && option === "secondary") || (row && option === "tertiary")) {
      onclick(option);
    }
  };

  return (
    <div
      className="absolute w-48 border border-primary-menu bg-white rounded shadow-lg z-50"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <ul className="">
        <li
          className="cursor-pointer py-2 px-4 hover:bg-gray-100 hover:rounded-t"
          onClick={() => handleOptionClick("primary")}
        >
          Add Primary Row
        </li>
        <li
          className="cursor-pointer py-2 px-4 hover:bg-gray-100 hover:rounded-t"
          onClick={() => handleOptionClick("secondary")}
        >
          Add Secondary Row
        </li>
        <li
          className="cursor-pointer py-2 px-4 hover:bg-gray-100 hover:rounded-t"
          onClick={() => handleOptionClick("tertiary")}
        >
          Add Tertiary Row
        </li>
      </ul>
    </div>
  );
};
