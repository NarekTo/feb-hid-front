import { FC, useEffect, useRef, useState } from "react";

interface DuplicateButtonProps {
  description: string;
  onclick: () => void;
}

export const DuplicateButton: FC<DuplicateButtonProps> = ({
  description,
  onclick,
}) => {
  return (
    <div
      className="bg-dark-blue text-white rounded-md px-4 py-1 text-xs cursor-pointer flex flex-col items-center justify-center"
      onClick={() => onclick()}
    >
      <p>{description}</p>
    </div>
  );
};
