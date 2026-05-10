"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CalendarDays,
  DollarSign,
  FileText,
  MapPin,
  Share2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TripDetail = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  isPublic?: boolean;
  shareUrl?: string;
};

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    async function loadTrip() {
      try {
        const response = await fetch(`/api/trips/${params.id}`);

        if (!response.ok) {
          toast.error("Trip not found");
          return;
        }

        const data = await response.json();
        setTrip(data);
        if (data.shareUrl) {
          setShareUrl(`${window.location.origin}/share/${data.shareUrl}`);
        }
      } catch (error) {
        console.error("Error loading trip:", error);
        toast.error("Failed to load trip");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [params.id]);

  const updateTrip = (field: keyof TripDetail, value: string | boolean) => {
    setTrip((current) => (current ? { ...current, [field]: value } : current));
  };

  const saveTrip = async () => {
    if (!trip) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/trips/${trip._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip),
      });

      if (!response.ok) {
        toast.error("Failed to save trip");
        return;
      }

      const updatedTrip = await response.json();
      setTrip(updatedTrip);
      toast.success("Trip saved");
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteTrip = async () => {
    if (!trip || !confirm("Are you sure you want to delete this trip?")) {
      return;
    }

    try {
      const response = await fetch(`/api/trips/${trip._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to delete trip");
        return;
      }

      toast.success("Trip deleted");
      router.push("/dashboard/trips");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("An error occurred");
    }
  };

  const generateShareLink = async () => {
    if (!trip) {
      return;
    }

    try {
      const response = await fetch(`/api/trips/${trip._id}/share`, {
        method: "POST",
      });

      if (!response.ok) {
        toast.error("Failed to create share link");
        return;
      }

      const data = await response.json();
      setTrip(data.trip);
      setShareUrl(data.shareUrl);
      await navigator.clipboard.writeText(data.shareUrl);
      toast.success("Public link copied");
    } catch (error) {
      console.error("Error sharing trip:", error);
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-600">Loading trip...</div>
    );
  }

  if (!trip) {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Trip not found</h1>
        <p className="mt-2 text-gray-600">
          This trip may have been deleted or is not available.
        </p>
        <Link href="/dashboard/trips">
          <Button className="mt-5">Back to Trips</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Link
            href="/dashboard/trips"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Back to trips
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {trip.title}
          </h1>
          <p className="mt-2 text-gray-600">{trip.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={saveTrip} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={generateShareLink}>
            <Share2 size={16} />
            Share
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={deleteTrip}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      {trip.coverImage && (
        <div
          className="h-64 w-full rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${trip.coverImage})` }}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Trip Details</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                value={trip.title}
                onChange={(event) => updateTrip("title", event.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                rows={5}
                value={trip.description}
                onChange={(event) =>
                  updateTrip("description", event.target.value)
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Input
                type="date"
                value={trip.startDate?.slice(0, 10)}
                onChange={(event) =>
                  updateTrip("startDate", event.target.value)
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Date
              </label>
              <Input
                type="date"
                value={trip.endDate?.slice(0, 10)}
                onChange={(event) => updateTrip("endDate", event.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Cover Image URL
              </label>
              <Input
                value={trip.coverImage || ""}
                onChange={(event) =>
                  updateTrip("coverImage", event.target.value)
                }
              />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900">Trip Snapshot</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarDays size={17} />
                <span>
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={17} />
                <span>Stops can be planned in Itinerary</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 size={17} />
                <span>{trip.isPublic ? "Public trip" : "Private trip"}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-gray-900">Public Sharing</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a read-only public itinerary URL others can view or copy.
            </p>
            {shareUrl && <Input className="mt-4" readOnly value={shareUrl} />}
            <Button
              variant="outline"
              className="mt-4 w-full justify-start"
              onClick={generateShareLink}
            >
              <Share2 size={16} />
              {shareUrl ? "Copy Public Link" : "Create Public Link"}
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-gray-900">Plan More</h2>
            <div className="mt-4 grid gap-2">
              <Link href="/dashboard/itinerary">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin size={16} />
                  Itinerary
                </Button>
              </Link>
              <Link href="/dashboard/budget">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign size={16} />
                  Budget
                </Button>
              </Link>
              <Link href="/dashboard/notes">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} />
                  Notes
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
