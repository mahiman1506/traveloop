"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  completed: boolean;
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "1", text: "Passport", category: "documents", completed: false },
    {
      id: "2",
      text: "Travel insurance",
      category: "documents",
      completed: false,
    },
    { id: "3", text: "Book flights", category: "documents", completed: false },
    {
      id: "4",
      text: "Reserve hotels",
      category: "documents",
      completed: false,
    },
    { id: "5", text: "Casual clothes", category: "clothing", completed: false },
    {
      id: "6",
      text: "Comfortable shoes",
      category: "clothing",
      completed: false,
    },
    {
      id: "7",
      text: "Phone charger",
      category: "electronics",
      completed: false,
    },
    {
      id: "8",
      text: "Travel adapter",
      category: "electronics",
      completed: false,
    },
  ]);

  const [newItem, setNewItem] = useState({ text: "", category: "misc" });

  const categories = [
    "documents",
    "clothing",
    "electronics",
    "toiletries",
    "medications",
    "misc",
  ];

  const addItem = () => {
    if (newItem.text.trim()) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          text: newItem.text,
          category: newItem.category,
          completed: false,
        },
      ]);
      setNewItem({ text: "", category: "misc" });
    }
  };

  const toggleComplete = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const resetChecklist = () => {
    setItems(items.map((item) => ({ ...item, completed: false })));
  };

  const completedCount = items.filter((item) => item.completed).length;
  const progress =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Packing Checklist
        </h1>
        <p className="text-gray-600">Don&apos;t forget anything!</p>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-gray-900">Overall Progress</h2>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-blue-600">
              {progress}%
            </span>
            <Button variant="outline" size="sm" onClick={resetChecklist}>
              Reset
            </Button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedCount} of {items.length} items packed
        </p>
      </Card>

      {/* Add Item */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Add Item</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Item name..."
            value={newItem.text}
            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
            className="flex-1"
          />
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            className="px-3 py-2 border rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} />
          </Button>
        </div>
      </Card>

      {/* Items by Category */}
      {categories.map((category) => {
        const categoryItems = items.filter(
          (item) => item.category === category,
        );
        if (categoryItems.length === 0) return null;

        return (
          <Card key={category} className="p-6">
            <h2 className="font-semibold capitalize mb-4 text-lg text-gray-900">
              {category}
            </h2>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => toggleComplete(item.id)}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={20} className="text-green-600" />
                    ) : (
                      <Circle size={20} className="text-gray-400" />
                    )}
                    <span
                      className={`${
                        item.completed
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
