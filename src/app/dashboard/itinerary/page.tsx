"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { SortableItem } from "@/components/SortableItem";

export default function ItineraryPage() {
  const [stops, setStops] = useState([
    {
      id: "1",
      city: "Paris",
      country: "France",
      startDate: "2024-06-01",
      endDate: "2024-06-03",
      activities: ["Eiffel Tower sunset", "Louvre morning visit"],
    },
    {
      id: "2",
      city: "London",
      country: "UK",
      startDate: "2024-06-04",
      endDate: "2024-06-06",
      activities: ["British Museum", "Thames evening walk"],
    },
  ]);

  const [newStop, setNewStop] = useState({
    city: "",
    country: "",
    startDate: "",
    endDate: "",
  });
  const [activityDrafts, setActivityDrafts] = useState<Record<string, string>>(
    {},
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stops.findIndex((s) => s.id === active.id);
      const newIndex = stops.findIndex((s) => s.id === over.id);
      setStops(arrayMove(stops, oldIndex, newIndex));
    }
  };

  const addStop = () => {
    if (
      newStop.city &&
      newStop.country &&
      newStop.startDate &&
      newStop.endDate
    ) {
      setStops([
        ...stops,
        {
          id: Date.now().toString(),
          ...newStop,
          activities: [],
        },
      ]);
      setNewStop({ city: "", country: "", startDate: "", endDate: "" });
    }
  };

  const deleteStop = (id: string) => {
    setStops(stops.filter((s) => s.id !== id));
  };

  const addActivityToStop = (id: string) => {
    const activity = activityDrafts[id]?.trim();
    if (!activity) {
      return;
    }

    setStops(
      stops.map((stop) =>
        stop.id === id
          ? { ...stop, activities: [...stop.activities, activity] }
          : stop,
      ),
    );
    setActivityDrafts({ ...activityDrafts, [id]: "" });
  };

  const removeActivityFromStop = (stopId: string, activity: string) => {
    setStops(
      stops.map((stop) =>
        stop.id === stopId
          ? {
              ...stop,
              activities: stop.activities.filter((item) => item !== activity),
            }
          : stop,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Itinerary Builder
        </h1>
        <p className="text-gray-600">Plan your trip stops and activities</p>
      </div>

      <Tabs defaultValue="stops" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stops">Stops</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="stops" className="space-y-4">
          {/* Add New Stop */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Add New Stop</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="City"
                value={newStop.city}
                onChange={(e) =>
                  setNewStop({ ...newStop, city: e.target.value })
                }
              />
              <Input
                placeholder="Country"
                value={newStop.country}
                onChange={(e) =>
                  setNewStop({ ...newStop, country: e.target.value })
                }
              />
              <Input
                type="date"
                value={newStop.startDate}
                onChange={(e) =>
                  setNewStop({ ...newStop, startDate: e.target.value })
                }
              />
              <Input
                type="date"
                value={newStop.endDate}
                onChange={(e) =>
                  setNewStop({ ...newStop, endDate: e.target.value })
                }
              />
              <Button
                onClick={addStop}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
          </Card>

          {/* Draggable Stops List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stops.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {stops.map((stop) => (
                  <SortableItem key={stop.id} id={stop.id}>
                    <Card className="p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                        <GripVertical
                          size={20}
                          className="text-gray-400 cursor-grab"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {stop.city}, {stop.country}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(stop.startDate).toLocaleDateString()} -{" "}
                            {new Date(stop.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteStop(stop.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                      </div>
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder={`Add activity in ${stop.city}`}
                            value={activityDrafts[stop.id] || ""}
                            onChange={(event) =>
                              setActivityDrafts({
                                ...activityDrafts,
                                [stop.id]: event.target.value,
                              })
                            }
                          />
                          <Button
                            variant="outline"
                            onClick={() => addActivityToStop(stop.id)}
                          >
                            Assign
                          </Button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {stop.activities.map((activity) => (
                            <button
                              key={activity}
                              onClick={() =>
                                removeActivityFromStop(stop.id, activity)
                              }
                              className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-red-50 hover:text-red-700"
                            >
                              {activity}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Trip Timeline</h2>
            <div className="space-y-4">
              {stops.map((stop, index) => (
                <div key={stop.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    {index < stops.length - 1 && (
                      <div className="w-1 h-12 bg-blue-200"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <h3 className="font-semibold text-gray-900">
                      {stop.city}, {stop.country}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(stop.startDate).toLocaleDateString()} -{" "}
                      {new Date(stop.endDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {stop.activities.map((activity) => (
                        <span
                          key={activity}
                          className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Calendar View</h2>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-semibold text-center p-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="border p-2 text-center text-sm">
                  {i + 1 <= 28 ? i + 1 : ""}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <div className="space-y-4">
            {["Arrival and orientation", "Main activities", "Departure day"].map(
              (section, index) => (
                <Card key={section} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-gray-900">
                        Section {index + 1}: {section}
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        Add timing, location, notes, required bookings, and
                        activity details for this part of the itinerary.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Section
                    </Button>
                  </div>
                </Card>
              ),
            )}
            <Button>Add another Section</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
