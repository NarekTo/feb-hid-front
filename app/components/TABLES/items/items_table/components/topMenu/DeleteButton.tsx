import { FC, useEffect, useRef, useState } from "react";

interface AddButtonProps {
  description: string;
  onclick: () => void;
}

export const DeleteButton: FC<AddButtonProps> = ({ description, onclick }) => {
  return (
    <div
      className="bg-dark-blue text-white rounded-md px-4 py-1 text-xs cursor-pointer flex flex-col items-center justify-center"
      onClick={() => onclick()}
    >
      <p>{description}</p>
    </div>
  );
};
