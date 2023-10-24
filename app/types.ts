import { ReactNode } from "react";

export interface User {
    name: string;
  }
  
  export interface Session {
    user?: User;
    department_code?: string;
  }

  export interface RootLayoutProps {
    children: ReactNode
  }

  