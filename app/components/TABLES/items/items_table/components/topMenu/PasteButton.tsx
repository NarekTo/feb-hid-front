import { FC } from "react";

interface PasteButtonProps {
  description: string;
  onclick: () => void;
  toggle: boolean;
}

export const PasteButton: FC<PasteButtonProps> = ({
  description,
  onclick,
  toggle,
}) => {
  return (
    <div className="relative flex flex-col items-center group">
      <button
        disabled={!toggle}
        className={`${
          toggle ? "bg-dark-blue" : "bg-slate-200"
        } text-white rounded-md px-4 py-1 text-xs  ${
          toggle && "cursor-pointer"
        } flex flex-col items-center justify-center`}
        onClick={() => onclick()}
      >
        <p>{description}</p>
      </button>
      {!toggle && (
        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center">
          <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-slate-300 shadow-lg rounded-md">
            Mark a row first
          </span>
          <div className="w-3 h-3 -mt-2 rotate-45 bg-slate-300"></div>
        </div>
      )}
    </div>
  );
};
