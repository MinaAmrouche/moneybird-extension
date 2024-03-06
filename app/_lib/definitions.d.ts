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

export type ProjectProductMap = Record<string, string>;
