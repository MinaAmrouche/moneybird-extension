import { fetchApiData } from "@/app/_lib/api/data";

export const fetchInvoice = async (id: string) => {
  try {
    return await fetchApiData(`sales_invoices/${id}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const createInvoice = async (data: object) => {
  try {
    return await fetchApiData("sales_invoices", "POST", data, {
      "Content-Type": "application/json",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateInvoice = async (id: string, data: object) => {
  try {
    return await fetchApiData(`sales_invoices/${id}`, "PATCH", data, {
      "Content-Type": "application/json",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
