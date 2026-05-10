"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    try {
      const response = await fetch("/api/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const deleteTrip = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Trip deleted successfully");
        setTrips(trips.filter((t: any) => t._id !== id));
      } else {
        toast.error("Failed to delete trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading trips...</div>;
  }

  const ongoingTrips = trips.slice(0, 1);
  const upcomingTrips = trips.slice(1, 3);
  const completedTrips = trips.slice(3);

  const renderTripCard = (trip: any) => (
    <Card key={trip._id} className="overflow-hidden hover:shadow-lg transition">
      {trip.coverImage && (
        <div
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${trip.coverImage})` }}
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{trip.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{trip.description}</p>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin size={16} className="mr-1" />
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/trips/${trip._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Edit size={16} className="mr-1" />
              View Details
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteTrip(trip._id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
        <Link href="/dashboard/trips/new">
          <Button className="bg-blue-600 hover:bg-blue-700">+ New Trip</Button>
        </Link>
      </div>

      {trips.length > 0 ? (
        <div className="space-y-8">
          {[
            ["Ongoing", ongoingTrips],
            ["Upcoming", upcomingTrips],
            ["Completed", completedTrips],
          ].map(([label, sectionTrips]) => (
            <section key={label as string}>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {label as string}
              </h2>
              {(sectionTrips as any[]).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(sectionTrips as any[]).map(renderTripCard)}
                </div>
              ) : (
                <Card className="p-6 text-gray-600">
                  No {String(label).toLowerCase()} trips yet.
                </Card>
              )}
            </section>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No trips yet
          </h2>
          <p className="text-gray-600 mb-4">
            Start planning your first adventure!
          </p>
          <Link href="/dashboard/trips/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create First Trip
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
