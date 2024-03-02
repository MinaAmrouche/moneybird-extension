import { fetchApiData } from "@/app/_lib/api";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const data = await fetchApiData(request, "sales_invoices", "POST", body);
    return Response.json(data);
  } catch (error) {
    console.error("Error creating invoice:", error);
  }
}
