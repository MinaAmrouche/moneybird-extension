import { Product } from "@/app/lib/definitions";

const PROJECT_1: string = process.env.PROJECT_1 || "";
const PROJECT_2: string = process.env.PROJECT_2 || "";
const PRODUCT_1: string = process.env.PRODUCT_1 || "";
const PRODUCT_2: string = process.env.PRODUCT_2 || "";

export const PRODUCTS: Record<string, Product> = {
  [PRODUCT_1]: {
    id: PRODUCT_1,
    rate: 65,
  },
  [PRODUCT_2]: {
    id: PRODUCT_2,
    rate: 75,
  },
};

export const PROJECT_PRODUCT_MAP: Record<string, string> = {
  [PROJECT_1]: PRODUCT_1,
  [PROJECT_2]: PRODUCT_2,
};
