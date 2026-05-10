import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Middleware to verify token
function verifyToken(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET all trips for user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(trips, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new trip
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, startDate, endDate, coverImage } =
      await req.json();

    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 },
      );
    }

    const trip = new Trip({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      coverImage: coverImage || "",
      userId,
      isPublic: false,
    });

    await trip.save();

    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
