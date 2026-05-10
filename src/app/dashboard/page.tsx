"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, DollarSign, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    try {
      const response = await fetch("/api/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data.slice(0, 3)); // Show recent 3 trips
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const stats = [
    {
      label: "Total Trips",
      value: trips.length,
      icon: MapPin,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Days Planned",
      value: "45",
      icon: Calendar,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Budget Spent",
      value: "$2,450",
      icon: DollarSign,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Friends Invited",
      value: "8",
      icon: Users,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const recommendedCities = [
    { name: "Paris, France", image: "🗼" },
    { name: "Tokyo, Japan", image: "🗾" },
    { name: "Barcelona, Spain", image: "🏖️" },
    { name: "Dubai, UAE", image: "🌴" },
    { name: "New York, USA", image: "🗽" },
    { name: "Rome, Italy", image: "🏛️" },
  ];

  const regionSelections = ["Country", "State", "Party type", "Budget"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your trips
          </p>
        </div>
        <Link href="/dashboard/trips/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            + Create Trip
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="flex min-h-56 items-center justify-center bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 p-8 text-center text-white">
          <div>
            <h2 className="text-4xl font-bold">Banner Image</h2>
            <p className="mt-3 text-lg">
              Discover places, compare routes, and continue planning from your
              previous trips.
            </p>
          </div>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-4">
          {regionSelections.map((selection) => (
            <Button key={selection} variant="outline">
              {selection}
            </Button>
          ))}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Trips</h2>
            {loading ? (
              <p className="text-gray-600">Loading trips...</p>
            ) : trips.length > 0 ? (
              <div className="space-y-4">
                {trips.map((trip: any) => (
                  <Link
                    key={trip._id}
                    href={`/dashboard/trips/${trip._id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {trip.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(trip.startDate).toLocaleDateString()} -{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <MapPin size={20} className="text-blue-600" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No trips yet. Create your first trip!
              </p>
            )}
          </Card>
        </div>

        {/* Recommended Cities */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Recommended Cities</h2>
            <div className="space-y-2">
              {recommendedCities.map((city) => (
                <button
                  key={city.name}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition"
                >
                  <span className="text-2xl mr-2">{city.image}</span>
                  <span className="font-medium text-gray-900">{city.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Trip Regional Selections</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Mountains", "Beaches", "Cities", "Cultural routes"].map((item) => (
            <div
              key={item}
              className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700"
            >
              {item}
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar size={24} />
            Plan Itinerary
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <DollarSign size={24} />
            Set Budget
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <MapPin size={24} />
            Find Activities
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Users size={24} />
            Invite Friends
          </Button>
        </div>
      </Card>
    </div>
  );
}
