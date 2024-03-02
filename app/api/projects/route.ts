import { NextRequest } from "next/server";
import { db } from "@/app/_lib/db";
import { getSession } from "@/app/_lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("You must be logged in.");
    }
    const user = session.user;
    const projects = await db.project.findMany({
      where: {
        userId: user.id,
      }
    });
    return Response.json(projects);
  } catch (error) {
    console.error("Error creating invoice:", error);
  }
}


export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("You must be logged in.");
    }
    const user = session.user;
    const body: { projectId: string; productId: string }[] =
      await request.json();
    const data = body.map(({ projectId, productId }) => ({
      projectId,
      productId,
      userId: user.id,
    }));
    await db.project.createMany({
      data,
    });
    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
  }
}
