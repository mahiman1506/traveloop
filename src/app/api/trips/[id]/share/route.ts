import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type ShareRouteContext = {
  params: Promise<{ id: string }>;
};

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

function createShareSlug(id: string) {
  return `${id}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: NextRequest, { params }: ShareRouteContext) {
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

    trip.isPublic = true;
    trip.shareUrl = trip.shareUrl || createShareSlug(id);
    await trip.save();

    const origin = req.nextUrl.origin;
    return NextResponse.json(
      {
        shareUrl: `${origin}/share/${trip.shareUrl}`,
        trip,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
