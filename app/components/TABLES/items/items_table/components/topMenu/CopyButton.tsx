import { FC, useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  description: string;
  onclick: () => void;
  toggle: boolean;
}

export const CopyButton: FC<CopyButtonProps> = ({
  description,
  onclick,
  toggle,
}) => {
  return (
    <div
      className={`${
        toggle ? "bg-dark-blue" : "bg-slate-200"
      } text-white rounded-md px-4 py-1 text-xs cursor-pointer flex flex-col items-center justify-center`}
      onClick={() => onclick()}
    >
      <p>{description}</p>
    </div>
  );
};
