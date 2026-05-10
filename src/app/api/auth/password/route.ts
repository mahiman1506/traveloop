import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
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

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Please provide current password, new password, and confirmation" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match" },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from your current password" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await user.matchPassword(currentPassword);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
