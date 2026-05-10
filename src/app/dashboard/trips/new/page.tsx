"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const tripSchema = z.object({
  folderName: z.string().optional(),
  cityFrom: z.string().optional(),
  cityTo: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  coverImage: z.string().optional(),
});

type TripFormData = z.infer<typeof tripSchema>;

const suggestions = [
  "Best scenic spots",
  "Local food walks",
  "Family activities",
  "Museum route",
  "Budget hotels",
  "Transit passes",
];

export default function NewTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const onSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to create trip");
        return;
      }

      const trip = await response.json();
      toast.success("Trip created successfully!");
      router.push(`/dashboard/trips/${trip._id}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Trip</h1>
        <p className="mt-2 text-gray-600">
          Build the basic folder, route, dates, and starting suggestions for
          your travel plan.
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Folder Name
            </label>
            <Input
              {...register("folderName")}
              placeholder="e.g., Japan 2026"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trip Title
            </label>
            <Input
              {...register("title")}
              placeholder="e.g., Summer Vacation to Japan"
              className="w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              {...register("description")}
              placeholder="Describe your trip..."
              rows={4}
              className="w-full"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select From
              </label>
              <Input
                {...register("cityFrom")}
                placeholder="Starting city"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select To
              </label>
              <Input
                {...register("cityTo")}
                placeholder="Destination city"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                {...register("startDate")}
                type="date"
                className="w-full"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input {...register("endDate")} type="date" className="w-full" />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL (Optional)
            </label>
            <Input
              {...register("coverImage")}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-3">
              Suggestions for places to visit and activities to perform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="h-28 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-700"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Trip"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
