import { fetchApiData } from "@/app/_lib/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await fetchApiData(request, "products");
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
