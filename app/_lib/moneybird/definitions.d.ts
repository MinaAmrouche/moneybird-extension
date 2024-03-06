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
