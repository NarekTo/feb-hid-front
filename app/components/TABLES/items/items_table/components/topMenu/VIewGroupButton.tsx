import { FC } from "react";

interface ViewGroupButtonProps {
  onclick: () => void;
  toggle: boolean;
}

export const ViewGroupButton: FC<ViewGroupButtonProps> = ({
  onclick,
  toggle,
}) => {
  console.log("BUTTON", toggle);
  return (
    <button
      className={`${
        toggle
          ? "bg-dark-blue "
          : "bg-white border-2 border-dark-blue text-dark-blue"
      } text-white  rounded-md px-4 py-1 text-xs cursor-pointer flex flex-col items-center justify-center`}
      onClick={() => onclick()}
    >
      <p>View Group</p>
    </button>
  );
};
