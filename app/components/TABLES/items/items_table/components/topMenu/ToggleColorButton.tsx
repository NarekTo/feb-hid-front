import { FC } from "react";

interface ToggleColorButtonProps {
  description: string;
  onclick: () => void;
  toggle: boolean;
}

export const ToggleColorButton: FC<ToggleColorButtonProps> = ({
  description,
  onclick,
  toggle,
}) => {
  return (
    <button
      disabled={!toggle}
      className={`${
        toggle ? "bg-dark-blue" : "bg-slate-200"
      } text-white rounded-md px-4 py-1 text-xs cursor-pointer flex flex-col items-center justify-center`}
      onClick={() => onclick()}
    >
      <p>{description}</p>
    </button>
  );
};
