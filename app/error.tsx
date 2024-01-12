"use client"; // Error components must be Client Components

import { useEffect } from "react";
import MainButton from "./components/UI_ATOMS/MainButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-full flex flex-col justify-start mt-24 items-center ">
      <h2 className="mb-4">Something went wrong!</h2>
      <p className="text-xs text-gray-500 mt-2 mb-4">
        Contact the IT department with error: {error.message}{" "}
      </p>
      <MainButton
        className="bg-dark-blue rounded-lg text-white px-3 py-2 shadow-xl"
        title="Try again"
        fun={
          // Attempt to recover by trying to re-render the segment
          () => window.location.reload()
        }
      >
        Try again
      </MainButton>
    </div>
  );
}
