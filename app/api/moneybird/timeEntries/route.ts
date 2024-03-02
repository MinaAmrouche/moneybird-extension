import { fetchApiData } from "@/app/_lib/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const data = await fetchApiData(
      request,
      `time_entries${
        searchParams
          ? `?filter=${encodeURIComponent(searchParams.replaceAll("=", ":").replaceAll("&", ","))}`
          : ""
      }`
    );
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching time entries:", error);
  }
}
