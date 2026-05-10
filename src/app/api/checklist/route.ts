import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import Checklist from "@/models/Checklist";

const CATEGORIES = new Set([
  "documents",
  "clothing",
  "electronics",
  "toiletries",
  "medications",
  "misc",
]);

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

function normalizeItems(items: any[] = []) {
  return items
    .filter((item) => item?.id && item?.text)
    .map((item) => {
      const category = String(item.category ?? "misc").toLowerCase();

      return {
        id: String(item.id),
        text: String(item.text).trim(),
        category: CATEGORIES.has(category) ? category : "misc",
        completed: Boolean(item.completed),
      };
    });
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = verifyToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checklist = await Checklist.findOne({ userId }).lean();

    return NextResponse.json(
      {
        items: checklist?.items ?? [],
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

    const { items } = await req.json();

    const checklist = await Checklist.findOneAndUpdate(
      { userId },
      {
        userId,
        items: normalizeItems(items),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return NextResponse.json(
      {
        items: checklist.items,
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
