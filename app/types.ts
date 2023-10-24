import { ReactNode } from "react";

export interface User {
    name: string;
  }
  
  export interface Session {
    user?: User;
    department_code?: string;
    accessToken: string;
  }

  export interface RootLayoutProps {
    children: ReactNode
  }



  //SQL TABLES

  interface ProjectBatches {
    job_id: string;
    batch_number: string;
    batch_name: string;
    batch_type: string;
    batch_status: string;
    user_id: string;
  }
  
  interface ProjectItems {
    Item_id: string;
    job_id: string;
    batch_number: string;
    location_code?: string;
    item_ref?: string;
    design_ref?: string;
    item_status: string;
    item_code?: string;
    additional_description?: string;
    quantity: number;
    spares: number;
    uom_code?: string;
    supplier_code?: string;
    manufacturer_id?: string;
    part_number?: string;
    actual_currency?: string;
    actual_exchange_rate: number;
    actual_value: number;
    budget_currency?: string;
    budget_exchange_rate: number;
    budget_value: number;
    client_markup: number;
    client_currency?: string;
    client_exchange_rate: number;
    client_value: number;
    group_number: string;
    group_sequence: string;
    package_code?: string;
    supplier_address_id?: string;
    del_address_id?: string;
    delivery_date?: Date;
    drawing_revision?: string;
    drawing_issue_date?: Date;
    Inquiry_id: string;
    order_id: string;
    order_number: string;
    country_of_origin?: string;
    quote_ref?: string;
    quote_date?: Date;
    shop_drawing?: string;
    sample?: string;
    inspection?: string;
    photograph?: string;
    reservation_number?: string;
    reservation_date?: Date;
    specifier_id?: string;
    design_notes?: string;
    user_notes?: string;
    supplier_notes?: string;
    created_date?: Date;
    modified_date?: Date;
  }
  
  interface ProjectProjects {
    job_id: number;
    project_number: string;
    project_name: string;
    client_number?: string;
    client_name?: string;
    project_manager: string;
    project_coordinator?: string;
    company_id: string;
    currency_code: string;
    project_type: string;
    start_date: Date;
    end_date: Date;
    status_code?: string;
  }
  
  interface PasswordReset {
    id: number;
    email?: string;
    token?: string;
    expiryDate?: Date;
    user_id?: string;
  }

  interface ProjectAuthorisations {
    job_id: number;
    user_id: string;
    authorisation?: string;
  }

  interface LookupStatusCodes {
    status_code: string;
    status_description?: string;
    table_name?: string;
    sequence?: string;
    short_description?: string;
  }

  interface AdminUsers {
    user_id: string;
    username: string;
    employment_status: string;
    forename?: string;
    surname?: string;
    email?: string;
    company_id?: string;
    department_code?: string;
    job_title_code?: string;
    app_password: string;
    app_privileges?: string;
  }