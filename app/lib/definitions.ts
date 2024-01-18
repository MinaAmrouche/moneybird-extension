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
  contact: {
    company_name: string;
  };
  project: {
    id: string;
    name: string;
  };
};

export type Row = {
  id: string;
  date: string;
  description: string;
  time: string;
  project: string;
  state: "Open" | "Non-billable" | "Billed";
  contact: string;
  amount: string;
};
