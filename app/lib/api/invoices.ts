import { unstable_noStore as noStore } from "next/cache";

export const fetchInvoice = async (id: string) => {
  noStore();

  const res = await fetch(
    `${process.env.API_URL}/${process.env.ADMINISTRATION_ID}/sales_invoices/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const createInvoice = async (data: object) => {
  noStore();

  const res = await fetch(
    `${process.env.API_URL}/${process.env.ADMINISTRATION_ID}/sales_invoices`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    console.error(res.status, ": ", res.statusText);
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const updateInvoice = async (id: string, data: object) => {
  noStore();

  const res = await fetch(
    `${process.env.API_URL}/${process.env.ADMINISTRATION_ID}/sales_invoices/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
