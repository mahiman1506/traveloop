"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import Link from "next/link";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  GripVertical,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { SortableItem } from "@/components/SortableItem";

type ItineraryStop = {
  id: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  activities: string[];
};

type ItinerarySection = {
  id: string;
  title: string;
  details: string;
};

type CalendarEntry = {
  stop: ItineraryStop;
  label: string;
  isStart: boolean;
  isEnd: boolean;
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDateInput(value: string) {
  return new Date(`${value}T00:00:00`);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const days = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

export default function ItineraryPage() {
  const [stops, setStops] = useState<ItineraryStop[]>([]);

  const [newStop, setNewStop] = useState({
    city: "",
    country: "",
    startDate: "",
    endDate: "",
  });
  const [activityDrafts, setActivityDrafts] = useState<Record<string, string>>(
    {},
  );
  const [sections, setSections] = useState<ItinerarySection[]>([]);
  const [newSection, setNewSection] = useState({
    title: "",
    details: "",
  });
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionDraft, setSectionDraft] = useState({
    title: "",
    details: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const persistItinerary = useCallback(
    async (nextStops: ItineraryStop[], nextSections: ItinerarySection[]) => {
      setSaving(true);

      try {
        const response = await fetch("/api/itinerary", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stops: nextStops,
            sections: nextSections,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Failed to save itinerary.");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Failed to save itinerary:", error);
        toast.error("Failed to save itinerary.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch("/api/itinerary");

        if (response.status === 401) {
          setIsLoggedIn(false);
          return;
        }

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Failed to load itinerary.");
          return;
        }

        const loadedStops = (result.stops ?? []).map((stop: any) => ({
            id: String(stop.id),
            city: stop.city ?? "",
            country: stop.country ?? "",
            startDate: stop.startDate
              ? new Date(stop.startDate).toISOString().slice(0, 10)
              : "",
            endDate: stop.endDate
              ? new Date(stop.endDate).toISOString().slice(0, 10)
              : "",
            activities: Array.isArray(stop.activities) ? stop.activities : [],
          }));

        setStops(loadedStops);
        const firstStop = loadedStops
          .filter((stop: ItineraryStop) => stop.startDate)
          .sort((a: ItineraryStop, b: ItineraryStop) =>
            a.startDate.localeCompare(b.startDate),
          )[0];

        if (firstStop) {
          const firstStopDate = parseDateInput(firstStop.startDate);
          setCalendarMonth(
            new Date(firstStopDate.getFullYear(), firstStopDate.getMonth(), 1),
          );
        }

        setSections(
          (result.sections ?? []).map((section: any) => ({
            id: String(section.id),
            title: section.title ?? "",
            details: section.details ?? "",
          })),
        );
      } catch (error) {
        console.error("Failed to load itinerary:", error);
        toast.error("Failed to load itinerary.");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stops.findIndex((s) => s.id === active.id);
      const newIndex = stops.findIndex((s) => s.id === over.id);
      const nextStops = arrayMove(stops, oldIndex, newIndex);
      setStops(nextStops);
      persistItinerary(nextStops, sections);
    }
  };

  const addStop = () => {
    if (
      newStop.city &&
      newStop.country &&
      newStop.startDate &&
      newStop.endDate
    ) {
      const nextStops = [
        ...stops,
        {
          id: Date.now().toString(),
          ...newStop,
          activities: [],
        },
      ];
      setStops(nextStops);
      persistItinerary(nextStops, sections);
      setNewStop({ city: "", country: "", startDate: "", endDate: "" });
    }
  };

  const deleteStop = (id: string) => {
    const nextStops = stops.filter((s) => s.id !== id);
    setStops(nextStops);
    persistItinerary(nextStops, sections);
  };

  const addActivityToStop = (id: string) => {
    const activity = activityDrafts[id]?.trim();
    if (!activity) {
      return;
    }

    const nextStops = stops.map((stop) =>
      stop.id === id
        ? { ...stop, activities: [...stop.activities, activity] }
        : stop,
    );

    setStops(nextStops);
    persistItinerary(nextStops, sections);
    setActivityDrafts({ ...activityDrafts, [id]: "" });
  };

  const removeActivityFromStop = (stopId: string, activity: string) => {
    const nextStops = stops.map((stop) =>
      stop.id === stopId
        ? {
            ...stop,
            activities: stop.activities.filter((item) => item !== activity),
          }
        : stop,
    );

    setStops(nextStops);
    persistItinerary(nextStops, sections);
  };

  const addSection = () => {
    const title = newSection.title.trim();
    const details = newSection.details.trim();

    if (!title) {
      return;
    }

    const nextSections = [
      ...sections,
      {
        id: Date.now().toString(),
        title,
        details:
          details ||
          "Add timing, location, notes, required bookings, and activity details for this part of the itinerary.",
      },
    ];

    setSections(nextSections);
    persistItinerary(stops, nextSections);
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

    const nextSections = sections.map((section) =>
      section.id === id
        ? {
            ...section,
            title,
            details: sectionDraft.details.trim(),
          }
        : section,
    );

    setSections(nextSections);
    persistItinerary(stops, nextSections);
    setEditingSectionId(null);
    setSectionDraft({ title: "", details: "" });
  };

  const cancelEditingSection = () => {
    setEditingSectionId(null);
    setSectionDraft({ title: "", details: "" });
  };

  const deleteSection = (id: string) => {
    const nextSections = sections.filter((section) => section.id !== id);
    setSections(nextSections);
    persistItinerary(stops, nextSections);
  };

  const calendarDays = buildCalendarDays(calendarMonth);
  const calendarEntries = stops.reduce<Record<string, CalendarEntry[]>>(
    (entries, stop) => {
      if (!stop.startDate || !stop.endDate) {
        return entries;
      }

      const startDate = parseDateInput(stop.startDate);
      const endDate = parseDateInput(stop.endDate);

      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return entries;
      }

      const currentDate = new Date(startDate);
      const finalDate = endDate < startDate ? startDate : endDate;

      while (currentDate <= finalDate) {
        const key = toDateKey(currentDate);
        const isStart = key === toDateKey(startDate);
        const isEnd = key === toDateKey(finalDate);

        entries[key] = [
          ...(entries[key] ?? []),
          {
            stop,
            isStart,
            isEnd,
            label:
              isStart && isEnd
                ? `${stop.city} stop`
                : isStart
                  ? `Arrive ${stop.city}`
                  : isEnd
                    ? `Leave ${stop.city}`
                    : stop.city,
          },
        ];

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return entries;
    },
    {},
  );

  const visibleMonthStops = stops.filter((stop) => {
    if (!stop.startDate || !stop.endDate) {
      return false;
    }

    const startDate = parseDateInput(stop.startDate);
    const endDate = parseDateInput(stop.endDate);
    const monthStart = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    );
    const monthEnd = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0,
    );

    return startDate <= monthEnd && endDate >= monthStart;
  });

  const goToPreviousMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
    );
  };

  const goToCurrentMonth = () => {
    const today = new Date();
    setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center text-gray-600">
          Loading itinerary...
        </Card>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please log in to manage your itinerary
          </h1>
          <p className="mt-2 text-gray-600">
            Your itinerary is saved to your TravelLoop account.
          </p>
          <Link href="/auth/login">
            <Button className="mt-5">Go to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Itinerary Builder
            </h1>
            <p className="text-gray-600">Plan your trip stops and activities</p>
          </div>
          {saving && (
            <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              Saving...
            </span>
          )}
        </div>
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
            id="itinerary-stops"
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
                {stops.length === 0 && (
                  <Card className="p-8 text-center text-gray-600">
                    No stops yet. Add your first destination to build the
                    itinerary.
                  </Card>
                )}
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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Calendar View
                </h2>
                <p className="text-sm text-gray-600">
                  {visibleMonthStops.length} stop
                  {visibleMonthStops.length === 1 ? "" : "s"} scheduled in{" "}
                  {monthFormatter.format(calendarMonth)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={goToCurrentMonth}>
                  Today
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goToNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-7 border-l border-t border-gray-200">
                  {weekdayLabels.map((day) => (
                    <div
                      key={day}
                      className="border-b border-r border-gray-200 bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700"
                    >
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((day, index) => {
                    const key = day ? toDateKey(day) : `empty-${index}`;
                    const entries = day ? calendarEntries[toDateKey(day)] ?? [] : [];
                    const isToday = day
                      ? toDateKey(day) === toDateKey(new Date())
                      : false;

                    return (
                      <div
                        key={key}
                        className={`min-h-32 border-b border-r border-gray-200 p-2 ${
                          day ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        {day && (
                          <>
                            <div
                              className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                                isToday
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700"
                              }`}
                            >
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {entries.map((entry) => (
                                <div
                                  key={`${entry.stop.id}-${entry.label}`}
                                  className="rounded-md bg-blue-50 px-2 py-1 text-left text-xs text-blue-800"
                                >
                                  <p className="font-semibold">{entry.label}</p>
                                  <p className="text-blue-700">
                                    {entry.stop.country}
                                  </p>
                                  {entry.isStart && entry.stop.activities.length > 0 && (
                                    <p className="mt-1 line-clamp-2 text-blue-700">
                                      {entry.stop.activities.join(", ")}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {stops.length === 0 && (
              <div className="mt-4 rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
                Add stops with dates to populate the calendar.
              </div>
            )}

            {stops.length > 0 && visibleMonthStops.length === 0 && (
              <div className="mt-4 rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
                No stops are scheduled for {monthFormatter.format(calendarMonth)}.
              </div>
            )}

            {visibleMonthStops.length > 0 && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {visibleMonthStops.map((stop) => (
                  <div
                    key={stop.id}
                    className="rounded-md border border-gray-200 bg-gray-50 p-3"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {stop.city}, {stop.country}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {dateFormatter.format(parseDateInput(stop.startDate))} -{" "}
                      {dateFormatter.format(parseDateInput(stop.endDate))}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
