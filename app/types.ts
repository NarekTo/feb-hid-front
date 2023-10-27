import { ReactNode } from "react";
import { Dispatch, SetStateAction } from "react";

//----------------------------------- general types
export interface User {
  name: string;
  email: string;
}

export interface Session {
  id: string;
  user_id: string;
  user?: User;
  department_code?: string;
  accessToken: string;
  app_privileges?: string;
}

export interface RootLayoutProps {
  children: ReactNode;
}

export interface Response {
  userProjects: ProjectProjects[];
  projects: ProjectProjects[];
}

//----------------------------------- items pages types
export interface SearchParams {
  job_id: string;
  project_name: string;
}
export interface BatchesListProps {
  projects: ProjectBatches[];
}

export interface ItemsProps {
  items: ProjectItems[];
  batchNum: string;
}

export interface ItemsParams {
  batch: string;
}
export interface SingleItemProps {
  item: itemInfoType;
}

export interface MainTableCrudProps {
  project: string;
  tableItems: ProjectItems[];
  setTableItems: Dispatch<SetStateAction<ProjectItems[]>>;
  batchNum: string;
}
export interface itemInfoType {
  projectItems: ProjectItems;
  projectSpecifications: ProjectItemSpecs;
  projectCompositions: ProjectItemCompositions;
  projectDimensions: ProjectItemDimensions;
}

//------------------------------------SQL TABLES TYPES
export interface ProjectItemSpecs {
  item_id: string;
  finish_code?: string;
  notes?: string;
  sequence?: number;
}

export interface ProjectItemImages {
  item_id: number;
  image_id: number;
  image_sequence: number;
}

export interface ProjectBatches {
  job_id: string;
  batch_number: string;
  batch_name: string;
  batch_type: string;
  batch_status: string;
  user_id: string;
}
export interface ProjectItemCompositions {
  item_id: string;
  material_code?: string;
  percentage?: number;
}

export interface ProjectItemDimensions {
  item_id: string;
  spec_code: string;
  uom_code: string;
  value?: number;
}

export interface ProjectItems {
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

export interface ProjectProjects {
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

export interface PasswordReset {
  id: number;
  email?: string;
  token?: string;
  expiryDate?: Date;
  user_id?: string;
}

export interface ProjectAuthorisations {
  job_id: number;
  user_id: string;
  authorisation?: string;
}

export interface LookupStatusCodes {
  status_code: string;
  status_description?: string;
  table_name?: string;
  sequence?: string;
  short_description?: string;
}

export interface AdminUsers {
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
