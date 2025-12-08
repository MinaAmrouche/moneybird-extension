export type TimeEntry = {
  id: string;
  started_at: string;
  ended_at: string;
  paused_duration: number;
  billable: boolean;
  description: string;
  detail: {
    created_at: string;
  };
  contact: Contact;
  project: Project;
  project_id: string;
};

export type Contact = {
  id: string;
  customer_id: string;
  company_name: string;
};

export type Product = {
  id: string;
  price: number;
  title: string;
  currency?: string;
  description?: string;
};

export type Project = {
  id: string;
  name: string;
  state: "active" | "archived";
};

export type Invoice = {
  id: string;
  invoice_id: string;
  invoice_date: string;
  created_at: string;
  updated_at: string;
  sent_at: string;
  paid_at: string | null;
  administration_id: string;
  contact_id: string;
  contact: Contact;
  details: {
    id: string;
    project_id: string;
    amount: string;
    product_id: string;
    description: string;
  }[];
};
