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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Edit3, GripVertical, Plus, Trash2, X } from "lucide-react";
import { SortableItem } from "@/components/SortableItem";

type ItinerarySection = {
  id: string;
  title: string;
  details: string;
};

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
  const [sections, setSections] = useState<ItinerarySection[]>([
    {
      id: "arrival",
      title: "Arrival and orientation",
      details:
        "Add timing, location, notes, required bookings, and activity details for this part of the itinerary.",
    },
    {
      id: "main-activities",
      title: "Main activities",
      details:
        "Add timing, location, notes, required bookings, and activity details for this part of the itinerary.",
    },
    {
      id: "departure",
      title: "Departure day",
      details:
        "Add timing, location, notes, required bookings, and activity details for this part of the itinerary.",
    },
  ]);
  const [newSection, setNewSection] = useState({
    title: "",
    details: "",
  });
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionDraft, setSectionDraft] = useState({
    title: "",
    details: "",
  });

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

  const addSection = () => {
    const title = newSection.title.trim();
    const details = newSection.details.trim();

    if (!title) {
      return;
    }

    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title,
        details:
          details ||
          "Add timing, location, notes, required bookings, and activity details for this part of the itinerary.",
      },
    ]);
    setNewSection({ title: "", details: "" });
  };

  const startEditingSection = (section: ItinerarySection) => {
    setEditingSectionId(section.id);
    setSectionDraft({
      title: section.title,
      details: section.details,
    });
  };

  const saveSection = (id: string) => {
    const title = sectionDraft.title.trim();

    if (!title) {
      return;
    }

    setSections(
      sections.map((section) =>
        section.id === id
          ? {
              ...section,
              title,
              details: sectionDraft.details.trim(),
            }
          : section,
      ),
    );
    setEditingSectionId(null);
    setSectionDraft({ title: "", details: "" });
  };

  const cancelEditingSection = () => {
    setEditingSectionId(null);
    setSectionDraft({ title: "", details: "" });
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
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
                    {({ attributes, listeners, isDragging }) => (
                    <Card
                      className={`p-4 transition ${
                        isDragging ? "shadow-lg" : "hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                        <button
                          type="button"
                          className="rounded-md p-1 text-gray-400 cursor-grab hover:bg-gray-100 active:cursor-grabbing"
                          aria-label={`Reorder ${stop.city}`}
                          {...attributes}
                          {...listeners}
                        >
                          <GripVertical size={20} />
                        </button>
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
                        type="button"
                        onClick={() => deleteStop(stop.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                        aria-label={`Delete ${stop.city}`}
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
                    )}
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
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Add Section</h2>
              <div className="space-y-3">
                <Input
                  placeholder="Section title"
                  value={newSection.title}
                  onChange={(event) =>
                    setNewSection({
                      ...newSection,
                      title: event.target.value,
                    })
                  }
                />
                <Textarea
                  placeholder="Timing, location, notes, bookings, or activity details"
                  value={newSection.details}
                  onChange={(event) =>
                    setNewSection({
                      ...newSection,
                      details: event.target.value,
                    })
                  }
                  rows={3}
                />
                <Button
                  onClick={addSection}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!newSection.title.trim()}
                >
                  <Plus size={16} className="mr-2" />
                  Add Section
                </Button>
              </div>
            </Card>

            {sections.map((section, index) => {
              const isEditing = editingSectionId === section.id;

              return (
                <Card key={section.id} className="p-6">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={sectionDraft.title}
                        onChange={(event) =>
                          setSectionDraft({
                            ...sectionDraft,
                            title: event.target.value,
                          })
                        }
                      />
                      <Textarea
                        value={sectionDraft.details}
                        onChange={(event) =>
                          setSectionDraft({
                            ...sectionDraft,
                            details: event.target.value,
                          })
                        }
                        rows={4}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveSection(section.id)}
                          disabled={!sectionDraft.title.trim()}
                        >
                          <Check size={16} className="mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditingSection}
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-bold text-gray-900">
                          Section {index + 1}: {section.title}
                        </h2>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                          {section.details ||
                            "Add timing, location, notes, required bookings, and activity details for this part of the itinerary."}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingSection(section)}
                        >
                          <Edit3 size={16} className="mr-2" />
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => deleteSection(section.id)}
                          className="p-2 text-red-600 hover:text-red-700"
                          aria-label={`Delete ${section.title}`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}

            {sections.length === 0 && (
              <Card className="p-8 text-center text-gray-600">
                No sections yet. Add one to organize your itinerary.
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
