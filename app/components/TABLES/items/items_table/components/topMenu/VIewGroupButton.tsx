import { FC } from "react";

interface ViewGroupButtonProps {
  onclick: () => void;
  toggle: boolean;
  row: any;
}

export const ViewGroupButton: FC<ViewGroupButtonProps> = ({
  onclick,
  toggle,
  row,
}) => {
  console.log("BUTTON", toggle);
  return (
    <button
      disabled={!row}
      className={`${
        toggle
          ? "bg-dark-blue text-white py-1 "
          : "bg-white outline outline-1  text-dark-blue box-border"
      } box-content rounded-md px-4  text-xs ${
        row ? "cursor-pointer" : "cursor-not-allowed"
      } flex flex-col items-center justify-center 
      `}
      onClick={() => onclick()}
    >
      <p>View Group</p>
    </button>
  );
};
//          : "bg-white border-2 border-dark-blue text-dark-blue"
