import Link from "next/link";
import {
  CalendarDays,
  Copy,
  MessageCircle,
  MapPin,
  Plane,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";

type SharePageProps = {
  params: Promise<{ shareUrl: string }>;
};

const fallbackStops = [
  {
    city: "Paris",
    country: "France",
    startDate: "2026-06-01",
    endDate: "2026-06-03",
    activities: ["Museum route", "Seine walk"],
  },
  {
    city: "Barcelona",
    country: "Spain",
    startDate: "2026-06-04",
    endDate: "2026-06-06",
    activities: ["Tapas evening", "Architecture tour"],
  },
];

async function getTrip(shareUrl: string) {
  try {
    await connectDB();
    const trip = await Trip.findOne({ shareUrl, isPublic: true }).lean();
    return trip ? JSON.parse(JSON.stringify(trip)) : null;
  } catch {
    return null;
  }
}

export default async function PublicItineraryPage({ params }: SharePageProps) {
  const { shareUrl } = await params;
  const trip = await getTrip(shareUrl);
  const stops = trip?.stops?.length ? trip.stops : fallbackStops;
  const title = trip?.title ?? "Shared TravelLoop Itinerary";
  const description =
    trip?.description ??
    "A read-only shared itinerary with cities, dates, activities, and trip inspiration.";
  const startDate = trip?.startDate ?? stops[0]?.startDate;
  const endDate = trip?.endDate ?? stops[stops.length - 1]?.endDate;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Plane size={26} />
            TravelLoop
          </Link>
          <Link href="/dashboard/trips/new">
            <Button>Copy Trip</Button>
          </Link>
        </nav>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-blue-600">
                  Public itinerary
                </p>
                <h1 className="mt-2 text-4xl font-bold text-gray-950">
                  {title}
                </h1>
                <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                  {description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" aria-label="Copy public URL">
                  <Copy size={16} />
                </Button>
                <Button variant="outline" aria-label="Share itinerary">
                  <Share2 size={16} />
                </Button>
                <Button variant="outline" aria-label="Share socially">
                  <MessageCircle size={16} />
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2">
                <CalendarDays size={16} />
                {new Date(startDate).toLocaleDateString()} -{" "}
                {new Date(endDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2">
                <MapPin size={16} />
                {stops.length} stops
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-gray-900">Estimated Budget</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              {[
                ["Transport", trip?.budget?.transportCost ?? 500],
                ["Stay", trip?.budget?.hotelCost ?? 1200],
                ["Activities", trip?.budget?.activityCost ?? 400],
                ["Meals", trip?.budget?.mealCost ?? 600],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span>{label}</span>
                  <span className="font-semibold text-gray-900">${value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="mt-6 space-y-4">
          {stops.map((stop: any, index: number) => (
            <Card key={`${stop.city}-${index}`} className="p-6">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">
                    Day {index + 1}: {stop.city}, {stop.country}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(stop.startDate).toLocaleDateString()} -{" "}
                    {new Date(stop.endDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  Read only
                </span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {(stop.activities?.length ? stop.activities : ["Arrival", "Local walk"]).map(
                  (activity: string) => (
                    <div
                      key={activity}
                      className="rounded-md border border-gray-200 bg-white p-4"
                    >
                      <p className="font-semibold text-gray-900">{activity}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Suggested activity block with timing and cost available
                        in the original trip.
                      </p>
                    </div>
                  ),
                )}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
