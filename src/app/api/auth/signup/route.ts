import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      name,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      city,
      country,
      additionalInfo,
    } = await req.json();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Create new user
    const user = new User({
      name,
      lastName: lastName || "",
      email,
      password,
      phone: phone || "",
      city: city || "",
      country: country || "",
      additionalInfo: additionalInfo || "",
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // Set HTTP only cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          city: user.city,
          country: user.country,
          additionalInfo: user.additionalInfo,
        },
        token,
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
