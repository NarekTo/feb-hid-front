"use client"
import React, { ReactNode } from 'react';

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default AuthLayout;
