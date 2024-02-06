import { unstable_noStore as noStore } from "next/cache";
import { getSession } from "@/app/lib/session";
import { User } from "@/app/lib/definitions";

export const fetchApiData = async (
  url: String,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body: Object | null = null,
  additionalHeaders: Record<string, string> = {}
) => {
  noStore();

  const session = await getSession();
  const user = (session?.user as User) || {};
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error("Access token not available.");
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ...additionalHeaders,
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/${user?.administrationId}/` + url,
      options
    );
    return await response.json();
  } catch (error) {
    console.error("Error making API request:", error);
    throw error;
  }
};

export const fetchAll = async (resource: string) => {
  try {
    return await fetchApiData(resource);
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
