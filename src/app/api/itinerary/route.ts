import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import Itinerary from "@/models/Itinerary";

type TokenPayload = {
  userId: string;
  email: string;
};

function verifyToken(req: NextRequest): string | null {
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

function normalizeStops(stops: any[] = []) {
  return stops
    .filter(
      (stop) =>
        stop?.id &&
        stop?.city &&
        stop?.country &&
        stop?.startDate &&
        stop?.endDate,
    )
    .map((stop) => ({
      id: String(stop.id),
      city: String(stop.city).trim(),
      country: String(stop.country).trim(),
      startDate: new Date(stop.startDate),
      endDate: new Date(stop.endDate),
      activities: Array.isArray(stop.activities)
        ? stop.activities.map((activity: unknown) => String(activity).trim()).filter(Boolean)
        : [],
    }));
}

function normalizeSections(sections: any[] = []) {
  return sections
    .filter((section) => section?.id && section?.title)
    .map((section) => ({
      id: String(section.id),
      title: String(section.title).trim(),
      details: section.details ? String(section.details).trim() : "",
    }));
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = verifyToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itinerary = await Itinerary.findOne({ userId }).lean();

    return NextResponse.json(
      {
        stops: itinerary?.stops ?? [],
        sections: itinerary?.sections ?? [],
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

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const userId = verifyToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stops, sections } = await req.json();

    const itinerary = await Itinerary.findOneAndUpdate(
      { userId },
      {
        userId,
        stops: normalizeStops(stops),
        sections: normalizeSections(sections),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return NextResponse.json(
      {
        stops: itinerary.stops,
        sections: itinerary.sections,
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
