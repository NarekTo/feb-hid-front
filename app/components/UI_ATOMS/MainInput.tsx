"use client"
import React, { FC, ChangeEvent } from "react";

interface MainInputProps {
  type: string;
  title: string;
  fun: (value: string) => void;
  inputValue: string;
  [x: string]: any;
}

 const MainInput: FC<MainInputProps> = ({ type, title, fun, inputValue, ...props }) => {
  return (
    <div className="flex flex-col" {...props}>
      <label className=" text-blue-800" htmlFor="password">
        {title}
      </label>
      <input
        className="rounded text-blue-800 border border-blue-800"
        type={type}
        name={title}
        required
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => fun(e.target.value)}
      />
    </div>
  );
};

export default MainInput;