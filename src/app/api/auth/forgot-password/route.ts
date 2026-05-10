import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Please provide your email address" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const message = "Password reset instructions sent if the email exists.";

    if (!user) {
      return NextResponse.json({ message }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.nextUrl.origin}/auth/reset-password/${resetToken}`;

    return NextResponse.json(
      {
        message,
        resetUrl,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
