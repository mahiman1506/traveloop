import Link from "next/link";
import { Plane, MapPin, CalendarDays, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Plan stops",
    description: "Arrange cities and dates into a clear trip route.",
    icon: MapPin,
  },
  {
    title: "Build itineraries",
    description: "Keep each day organized from first arrival to last checkout.",
    icon: CalendarDays,
  },
  {
    title: "Track budget",
    description: "See transport, hotels, meals, activities, and extras together.",
    icon: WalletCards,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Plane size={30} />
            <span>TravelLoop</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Trip planning workspace
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-tight text-gray-950">
              TravelLoop
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Plan trips, organize stops, track budgets, manage notes, and keep
              packing lists in one focused dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button size="lg">Open Dashboard</Button>
              </Link>
              <Link href="/dashboard/trips/new">
                <Button size="lg" variant="outline">
                  Create Trip
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title} className="p-5">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-950">
                        {feature.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
