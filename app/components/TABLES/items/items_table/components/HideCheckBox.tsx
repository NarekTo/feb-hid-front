import React from "react";

const HideCheckBox = ({ column }) => {
  return (
    <div key={column.id} className="px-1">
      <input
        id={`checkbox-${column.id}`}
        className="hidden"
        type="checkbox"
        checked={column.getIsVisible()}
        onChange={column.getToggleVisibilityHandler()}
      />
      <label
        htmlFor={`checkbox-${column.id}`}
        className="cursor-pointer inline-block"
      >
        <span
          className={` w-4 h-4 border-2 rounded relative flex justify-center items-center ${
            column.getIsVisible() ? "bg-dark-blue" : "bg-white"
          } border-dark-blue mr-1`}
        >
          {column.getIsVisible() && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-check"
            >
              <polyline points="6 12 10 16 18 8"></polyline>
            </svg>
          )}
        </span>
      </label>
      {column.id}
    </div>
  );
};

export default HideCheckBox;
