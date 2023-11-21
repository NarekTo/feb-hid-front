"use client"
import React, { FC, MouseEvent, ButtonHTMLAttributes } from "react";

interface MainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  fun?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const MainButton: FC<MainButtonProps> = ({ title, fun, ...props }) => {
  return (
    <button
      type={props.type}
      className="disabled:opacity-75 bg-primary-button px-6 py-1 text-sm rounded-md text-white shadow-lg hover:bg-secondary-button hover:shadow-sm"
      onClick={(e) => {
        props.type !== "submit" && fun(e);
      }}
      {...props}
    >
      {title}
    </button>
  );
};

export default MainButton;