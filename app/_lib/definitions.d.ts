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

export type State = "all" | "open" | "billed" | "non-billable";

export type Period =
  | "this_month"
  | "prev_month"
  | "next_month"
  | "this_quarter"
  | "prev_quarter"
  | "next_quarter"
  | "this_year"
  | "prev_year"
  | "next_year";
