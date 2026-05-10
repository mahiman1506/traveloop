"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, MapPin, Plus, Search, Star, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const destinations = [
  {
    city: "Paris",
    country: "France",
    region: "Europe",
    costIndex: 82,
    popularity: 96,
    category: "Culture",
    rating: "4.9",
    description: "Museums, food markets, river walks, and classic landmarks.",
  },
  {
    city: "Tokyo",
    country: "Japan",
    region: "Asia",
    costIndex: 76,
    popularity: 94,
    category: "City",
    rating: "4.8",
    description: "Neighborhood hopping, food alleys, gardens, and day trips.",
  },
  {
    city: "Barcelona",
    country: "Spain",
    region: "Europe",
    costIndex: 68,
    popularity: 91,
    category: "Coast",
    rating: "4.7",
    description: "Architecture, beach time, tapas routes, and hilltop views.",
  },
  {
    city: "Dubai",
    country: "UAE",
    region: "Middle East",
    costIndex: 88,
    popularity: 89,
    category: "Luxury",
    rating: "4.6",
    description: "Desert experiences, skyline views, shopping, and dining.",
  },
  {
    city: "New York",
    country: "USA",
    region: "North America",
    costIndex: 91,
    popularity: 93,
    category: "City",
    rating: "4.8",
    description: "Neighborhood walks, skyline views, museums, and food halls.",
  },
  {
    city: "Goa",
    country: "India",
    region: "Asia",
    costIndex: 42,
    popularity: 86,
    category: "Coast",
    rating: "4.6",
    description: "Beaches, forts, markets, seafood, and relaxed day plans.",
  },
];

const activities = [
  {
    title: "Historic walking tour",
    city: "Paris",
    type: "Culture",
    cost: 45,
    duration: "3h",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
    description: "A guided route through landmarks, neighborhoods, and local stories.",
  },
  {
    title: "Night food crawl",
    city: "Tokyo",
    type: "Food",
    cost: 65,
    duration: "2.5h",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    description: "Small-group tasting stops through izakaya lanes and street food stalls.",
  },
  {
    title: "Sagrada Familia and tapas",
    city: "Barcelona",
    type: "Culture",
    cost: 58,
    duration: "4h",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80",
    description: "Architecture highlights followed by a practical tapas route.",
  },
  {
    title: "Desert sunrise drive",
    city: "Dubai",
    type: "Adventure",
    cost: 95,
    duration: "5h",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    description: "Early desert views, dune stops, and a relaxed breakfast camp.",
  },
  {
    title: "Museum mile plan",
    city: "New York",
    type: "Sightseeing",
    cost: 35,
    duration: "3h",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=900&q=80",
    description: "A timed museum route with nearby coffee and meal stops.",
  },
  {
    title: "Fort and beach loop",
    city: "Goa",
    type: "Nature",
    cost: 25,
    duration: "4h",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
    description: "A breezy route across forts, beaches, markets, and sunset points.",
  },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [region, setRegion] = useState(searchParams.get("region") ?? "All");
  const [activityType, setActivityType] = useState(
    searchParams.get("activityType") ?? "All",
  );

  const filteredDestinations = useMemo(
    () =>
      destinations.filter((destination) => {
        const matchesQuery = `${destination.city} ${destination.country} ${destination.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesRegion = region === "All" || destination.region === region;
        return matchesQuery && matchesRegion;
      }),
    [query, region],
  );

  const filteredActivities = useMemo(
    () =>
      activities.filter((activity) => {
        const matchesQuery = `${activity.title} ${activity.city} ${activity.description}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesType =
          activityType === "All" || activity.type === activityType;
        return matchesQuery && matchesType;
      }),
    [activityType, query],
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
            <p className="mt-2 text-gray-600">
              Browse destination ideas and start a trip from the places that fit
              your travel style.
            </p>
          </div>
          <Link href="/dashboard/trips/new">
            <Button>Create Trip</Button>
          </Link>
        </div>

        <Card className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search cities, countries, or activities"
                className="pl-10"
              />
            </div>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              {["All", "Europe", "Asia", "Middle East", "North America"].map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>
            <select
              value={activityType}
              onChange={(event) => setActivityType(event.target.value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              {["All", "Culture", "Food", "Adventure", "Sightseeing", "Nature"].map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>
          </div>
        </Card>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">City Search</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {filteredDestinations.map((destination) => (
            <Card key={destination.city} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                    {destination.category}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-950">
                    {destination.city}, {destination.country}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {destination.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
                    <span className="rounded-md bg-gray-100 px-2 py-1">
                      {destination.region}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-1">
                      Cost index {destination.costIndex}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-1">
                      Popularity {destination.popularity}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700">
                  <Star size={15} className="text-yellow-500" />
                  {destination.rating}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  Suggested destination
                </div>
                <Link href="/dashboard/trips/new">
                  <Button variant="outline" size="sm">
                    Add to Trip
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Activity Search</h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {filteredActivities.map((activity) => (
              <Card key={activity.title} className="overflow-hidden">
                <div
                  className="h-36 bg-cover bg-center"
                  style={{ backgroundImage: `url(${activity.image})` }}
                />
                <div className="space-y-4 p-5">
                  <div>
                    <div className="mb-2 inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {activity.type}
                    </div>
                    <h3 className="font-semibold text-gray-950">
                      {activity.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={15} />
                      {activity.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={15} />
                      {activity.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <WalletCards size={15} />${activity.cost}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus size={16} />
                    Add Activity
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <Card className="p-8 text-center text-gray-600">
              Loading explore...
            </Card>
          </div>
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
