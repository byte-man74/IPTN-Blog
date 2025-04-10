import { auth } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";


export async function checkAuth(
  request: NextRequest,
  next: () => Promise<NextResponse>,
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          status: 401,
          details: "You must be logged in",
        },
        { status: 401 },
      );
    }

    return next();
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        status: 500,
        details: error,
      },
      { status: 500 },
    );
  }
}
