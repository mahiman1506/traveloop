import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type TripRouteContext = {
  params: Promise<{ id: string }>;
};

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

// GET single trip
export async function GET(
  req: NextRequest,
  { params }: TripRouteContext,
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid trip ID" }, { status: 400 });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Check if trip is public or user owns it
    const userId = verifyToken(req);
    if (!trip.isPublic && trip.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(trip, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update trip
export async function PUT(
  req: NextRequest,
  { params }: TripRouteContext,
) {
  try {
    await connectDB();

    const userId = verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid trip ID" }, { status: 400 });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();
    Object.assign(trip, updates);
    await trip.save();

    return NextResponse.json(trip, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE trip
export async function DELETE(
  req: NextRequest,
  { params }: TripRouteContext,
) {
  try {
    await connectDB();

    const userId = verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid trip ID" }, { status: 400 });
    }

    const trip = await Trip.findById(id);

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await Trip.deleteOne({ _id: id });

    return NextResponse.json(
      { message: "Trip deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
