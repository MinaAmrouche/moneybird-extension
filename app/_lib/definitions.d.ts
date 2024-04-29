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

export const STATES = ["all", "open", "billed", "non_billable"];

export type State = (typeof STATES)[number];

export const PERIODS = [
  "this_month",
  "prev_month",
  "this_quarter",
  "prev_quarter",
  "this_year",
  "prev_year",
];

export type Period = (typeof PERIODS)[number];
