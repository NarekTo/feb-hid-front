"use client"
import Link from 'next/link';
import React, { FC } from 'react';

interface MessageProps {
  title: string;
  message: string;
  link?: {
    href: string;
    text: string;
  };
}

 const Message: FC<MessageProps> = ({ title, message, link }) => {
  return (
    <div className="w-full h-full flex flex-col justify-start mt-20 items-center ">
      <h2>{title}</h2>
      <p>{message}</p>
      {link && <Link href={link.href}><a className="bg-dark-blue text-white py-3 px-6 rounded-lg shadow-md hover:shadow-none mt-6">{link.text}</a></Link>}
    </div>
  );
}

export default Message;