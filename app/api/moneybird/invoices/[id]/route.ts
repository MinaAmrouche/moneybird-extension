import { fetchApiData } from "@/app/_lib/api";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  try {
    const data = await fetchApiData(
      request,
      `sales_invoices/${params.id}`,
      "PATCH",
      body
    );
    return Response.json(data);
  } catch (error) {
    console.error(`Error updating invoice ${params.id}:`, error);
  }
}
