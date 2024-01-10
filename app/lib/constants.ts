const PROJECT_1: string = process.env.PROJECT_1 || "";
const PROJECT_2: string = process.env.PROJECT_2 || "";

export const RATES: Record<string, number> = {
  [PROJECT_1]: 65,
  [PROJECT_2]: 75,
};
