import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import User from "@/models/User";

const chartColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function monthKey(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function getBudgetTotal(trip: any) {
  const budget = trip.budget || {};
  return (
    (budget.transportCost || 0) +
    (budget.hotelCost || 0) +
    (budget.activityCost || 0) +
    (budget.mealCost || 0) +
    (budget.miscCost || 0)
  );
}

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [users, trips] = await Promise.all([
      User.find().select("name email createdAt").sort({ createdAt: -1 }).lean(),
      Trip.find().select("title startDate endDate createdAt stops activities budget isPublic userId").lean(),
    ]);

    const totalUsers = users.length;
    const totalTrips = trips.length;
    const activeTrips = trips.filter((trip: any) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      return start <= now && end >= now;
    }).length;
    const totalBudget = trips.reduce((sum: number, trip: any) => sum + getBudgetTotal(trip), 0);
    const publicTrips = trips.filter((trip: any) => trip.isPublic).length;

    const monthLabels = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      return monthKey(date);
    });

    const userGrowth = monthLabels.map((month) => ({ month, users: 0 }));
    users.forEach((user: any) => {
      const createdAt = new Date(user.createdAt);
      if (createdAt >= sixMonthsAgo) {
        const index = userGrowth.findIndex((item) => item.month === monthKey(createdAt));
        if (index >= 0) {
          userGrowth[index].users += 1;
        }
      }
    });

    const tripGrowth = monthLabels.map((month) => ({ month, trips: 0 }));
    trips.forEach((trip: any) => {
      const createdAt = new Date(trip.createdAt);
      if (createdAt >= sixMonthsAgo) {
        const index = tripGrowth.findIndex((item) => item.month === monthKey(createdAt));
        if (index >= 0) {
          tripGrowth[index].trips += 1;
        }
      }
    });

    const cityCounts = new Map<string, number>();
    const activityCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();

    trips.forEach((trip: any) => {
      const stops = trip.stops || [];
      stops.forEach((stop: any) => {
        if (stop.city) {
          const city = `${stop.city}${stop.country ? `, ${stop.country}` : ""}`;
          cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
        }

        (stop.activities || []).forEach((activity: string) => {
          activityCounts.set(activity, (activityCounts.get(activity) || 0) + 1);
          const lower = activity.toLowerCase();
          const category = lower.includes("food")
            ? "Food"
            : lower.includes("museum") || lower.includes("history") || lower.includes("culture")
              ? "Cultural"
              : lower.includes("beach") || lower.includes("nature") || lower.includes("walk")
                ? "Nature"
                : lower.includes("tour") || lower.includes("adventure")
                  ? "Adventure"
                  : "General";
          categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
        });
      });

      (trip.activities || []).forEach((activity: string) => {
        activityCounts.set(activity, (activityCounts.get(activity) || 0) + 1);
      });
    });

    const popularCities = Array.from(cityCounts.entries())
      .map(([city, count]) => ({ city, trips: count }))
      .sort((a, b) => b.trips - a.trips)
      .slice(0, 6);

    const topActivities = Array.from(activityCounts.entries())
      .map(([name, count]) => ({ name, bookings: count }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 6);

    const tripsCategoryData = Array.from(categoryCounts.entries())
      .map(([name, value], index) => ({
        name,
        value,
        fill: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.value - a.value);

    const tripCountByUser = new Map<string, number>();
    trips.forEach((trip: any) => {
      const userId = trip.userId?.toString();
      if (userId) {
        tripCountByUser.set(userId, (tripCountByUser.get(userId) || 0) + 1);
      }
    });

    const recentUsers = users.slice(0, 8).map((user: any) => ({
      name: user.name,
      email: user.email,
      joinDate: new Date(user.createdAt).toISOString(),
      trips: tripCountByUser.get(user._id.toString()) || 0,
    }));

    return NextResponse.json({
      analyticsData: {
        totalUsers,
        totalTrips,
        activeTrips,
        totalBudget,
        publicTrips,
      },
      userGrowth,
      tripGrowth,
      tripsCategoryData,
      popularCities,
      topActivities,
      recentUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
