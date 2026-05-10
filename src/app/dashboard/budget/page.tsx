"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function BudgetPage() {
  const [budget, setBudget] = useState({
    transportCost: 500,
    hotelCost: 1200,
    activityCost: 400,
    mealCost: 600,
    miscCost: 300,
  });

  const [expenses] = useState([
    {
      day: "Day 1",
      transport: 100,
      hotel: 150,
      activity: 50,
      meal: 80,
      misc: 20,
    },
    {
      day: "Day 2",
      transport: 0,
      hotel: 150,
      activity: 100,
      meal: 90,
      misc: 30,
    },
    {
      day: "Day 3",
      transport: 150,
      hotel: 150,
      activity: 80,
      meal: 85,
      misc: 25,
    },
    {
      day: "Day 4",
      transport: 250,
      hotel: 150,
      activity: 170,
      meal: 115,
      misc: 50,
    },
    {
      day: "Day 5",
      transport: 0,
      hotel: 150,
      activity: 0,
      meal: 150,
      misc: 155,
    },
  ]);

  const total = Object.values(budget).reduce((sum, val) => sum + val, 0);
  const totalTripDays = expenses.length;
  const averageCostPerDay = Math.round(total / totalTripDays);
  const dailyLimit = 650;
  const overBudgetDays = expenses
    .map((expense) => ({
      day: expense.day,
      total:
        expense.transport +
        expense.hotel +
        expense.activity +
        expense.meal +
        expense.misc,
    }))
    .filter((expense) => expense.total > dailyLimit);

  const chartData = [
    { name: "Transport", value: budget.transportCost, fill: "#3b82f6" },
    { name: "Hotel", value: budget.hotelCost, fill: "#10b981" },
    { name: "Activities", value: budget.activityCost, fill: "#f59e0b" },
    { name: "Meals", value: budget.mealCost, fill: "#ef4444" },
    { name: "Misc", value: budget.miscCost, fill: "#8b5cf6" },
  ];

  const handleBudgetChange = (key: string, value: string) => {
    setBudget({
      ...budget,
      [key]: parseFloat(value) || 0,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Budget Planner
        </h1>
        <p className="text-gray-600">Plan and track your trip expenses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Form */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Budget Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(budget).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">$</span>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleBudgetChange(key, e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${total}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pie Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Budget Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Bar Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Daily Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="transport" fill="#3b82f6" name="Transport" />
                <Bar dataKey="hotel" fill="#10b981" name="Hotel" />
                <Bar dataKey="activity" fill="#f59e0b" name="Activity" />
                <Bar dataKey="meal" fill="#ef4444" name="Meal" />
                <Bar dataKey="misc" fill="#8b5cf6" name="Misc" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Budget Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{item.name}</p>
              <p className="text-2xl font-bold text-gray-900">${item.value}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((item.value / total) * 100).toFixed(0)}% of total
              </p>
            </div>
          ))}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">Average per day</p>
            <p className="text-2xl font-bold text-blue-900">
              ${averageCostPerDay}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Based on {totalTripDays} planned days
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Budget Alerts</h2>
        {overBudgetDays.length > 0 ? (
          <div className="space-y-3">
            {overBudgetDays.map((expense) => (
              <div
                key={expense.day}
                className="flex items-center justify-between rounded-lg bg-red-50 p-4 text-sm"
              >
                <span className="font-semibold text-red-800">
                  {expense.day} is over the ${dailyLimit} daily target
                </span>
                <span className="font-bold text-red-900">${expense.total}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">All planned days are within budget.</p>
        )}
      </Card>
    </div>
  );
}
