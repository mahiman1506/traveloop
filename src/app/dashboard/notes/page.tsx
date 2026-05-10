"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar } from "lucide-react";

interface Note {
  id: string;
  date: Date;
  title: string;
  content: string;
  scope: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      date: new Date("2024-06-01"),
      title: "Arrival Day",
      scope: "Paris stop",
      content:
        "Successfully arrived in Paris! The hotel is beautiful and the staff is very helpful. Weather is perfect!",
    },
    {
      id: "2",
      date: new Date("2024-06-02"),
      title: "Eiffel Tower Visit",
      scope: "Day 2",
      content:
        "Visited the Eiffel Tower today. The sunset view was breathtaking. Had dinner at a local bistro.",
    },
  ]);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    scope: "Trip",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const addNote = () => {
    if (newNote.title && newNote.content) {
      setNotes([
        {
          id: Date.now().toString(),
          date: new Date(),
          title: newNote.title,
          content: newNote.content,
          scope: newNote.scope,
        },
        ...notes,
      ]);
      setNewNote({ title: "", content: "", scope: "Trip" });
    }
  };

  const saveEditedNote = (id: string, field: keyof Note, value: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, [field]: value } : note,
      ),
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Travel Journal
        </h1>
        <p className="text-gray-600">
          Document your travel memories and experiences
        </p>
      </div>

      {/* Add New Note */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Add New Note</h2>
        <div className="space-y-4">
          <Input
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <select
            value={newNote.scope}
            onChange={(e) => setNewNote({ ...newNote, scope: e.target.value })}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option>Trip</option>
            <option>Day 1</option>
            <option>Day 2</option>
            <option>Paris stop</option>
            <option>London stop</option>
          </select>
          <Textarea
            placeholder="Write your thoughts and memories here..."
            rows={4}
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
          />
          <Button
            onClick={addNote}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            <Plus size={16} className="mr-2" />
            Add Note
          </Button>
        </div>
      </Card>

      {/* Notes Timeline */}
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div key={note.id} className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              {index < notes.length - 1 && (
                <div className="w-1 h-24 bg-blue-200"></div>
              )}
            </div>

            {/* Note Card */}
            <Card className="flex-1 p-6 mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  {editingId === note.id ? (
                    <Input
                      value={note.title}
                      onChange={(event) =>
                        saveEditedNote(note.id, "title", event.target.value)
                      }
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-gray-900">
                      {note.title}
                    </h3>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Calendar size={16} />
                    {note.date.toLocaleDateString()} · {note.scope}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditingId(editingId === note.id ? null : note.id)
                    }
                  >
                    {editingId === note.id ? "Done" : "Edit"}
                  </Button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              {editingId === note.id ? (
                <Textarea
                  rows={4}
                  value={note.content}
                  onChange={(event) =>
                    saveEditedNote(note.id, "content", event.target.value)
                  }
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {note.content}
                </p>
              )}
            </Card>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-600">
            No notes yet. Start documenting your trip!
          </p>
        </Card>
      )}
    </div>
  );
}
