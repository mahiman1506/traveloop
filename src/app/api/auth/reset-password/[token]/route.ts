import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    await connectDB();

    const { token } = await params;
    const { password, confirmPassword } = await req.json();

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: "Please provide password and confirmation" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) {
      return NextResponse.json(
        { error: "Reset link is invalid or has expired" },
        { status: 400 },
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
