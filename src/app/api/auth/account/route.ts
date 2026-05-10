import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import User from "@/models/User";

type TokenPayload = {
  userId: string;
  email: string;
};

function getUserIdFromToken(req: NextRequest): string | null {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await Promise.all([
      Trip.deleteMany({ userId }),
      User.deleteOne({ _id: userId }),
    ]);

    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
