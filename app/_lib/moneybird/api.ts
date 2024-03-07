import { getSession } from "@/app/_lib/session";

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

  const options: {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    headers: Record<string, string>;
    body?: string;
  } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
      Authorization: "Bearer " + session.accessToken,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const fullUrl =
    `${process.env.API_URL}/${session.user.administrationId}/` + url;
  const response = await fetch(fullUrl, options);

  if (response.statusText !== "OK") {
    const error = await response.json();
    throw new Error(error);
  }

  return await response.json();
};
