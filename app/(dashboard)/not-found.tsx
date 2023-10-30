import Link from "next/link";
import { FC } from "react";

const NotFound: FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-start mt-20 items-center ">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link
        className="bg-dark-blue text-white py-3 px-6 rounded-lg shadow-md hover:shadow-none mt-6"
        href="/"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
