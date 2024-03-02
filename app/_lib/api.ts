import { unstable_noStore as noStore } from "next/cache";
import { getSession } from "@/app/_lib/session";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const fetchMoneyirdData = async (
  url: string,
  accessToken: string,
  administrationId: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body: Object | null = null,
  additionalHeaders: Record<string, string> = {}
) => {
  noStore();

  const options: {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    headers: Record<string, string>;
    body?: string;
  } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
      Authorization: "Bearer " + accessToken,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const fullUrl = `${process.env.API_URL}/${administrationId}/` + url;
    const response = await fetch(fullUrl, options);
    return await response.json();
  } catch (error) {
    console.error("Error making API request:", error);
    throw error;
  }
};

export const fetchData = async (
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body: Object | null = null,
  additionalHeaders: Record<string, string> = {}
) => {
  const session = await getSession();

  if (!session) {
    throw new Error("You must be logged in.");
  }

  const data = await fetchMoneyirdData(
    url,
    session.accessToken,
    session.user.administrationId,
    method,
    body,
    additionalHeaders
  );
  return data;
};

export const fetchApiData = async (
  req: NextRequest,
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body: Object | null = null,
  additionalHeaders: Record<string, string> = {}
) => {
  const token = await getToken({ req });

  if (!token) {
    return Response.redirect("/api/auth/signin");
  }

  const session = await getSession();
  if (!session) {
    throw new Error("You must be logged in.");
  }

  return fetchMoneyirdData(
    url,
    token.accessToken,
    session.user.administrationId,
    method,
    body,
    additionalHeaders
  );
};
