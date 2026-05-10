"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Users, MapPin, Zap, TrendingUp } from "lucide-react";

type AnalyticsResponse = {
  analyticsData: {
    totalUsers: number;
    totalTrips: number;
    activeTrips: number;
    totalBudget: number;
    publicTrips: number;
  };
  userGrowth: Array<{ month: string; users: number }>;
  tripGrowth: Array<{ month: string; trips: number }>;
  tripsCategoryData: Array<{ name: string; value: number; fill: string }>;
  popularCities: Array<{ city: string; trips: number }>;
  topActivities: Array<{ name: string; bookings: number }>;
  recentUsers: Array<{
    name: string;
    email: string;
    joinDate: string;
    trips: number;
  }>;
};

const emptyAnalytics: AnalyticsResponse = {
  analyticsData: {
    totalUsers: 0,
    totalTrips: 0,
    activeTrips: 0,
    totalBudget: 0,
    publicTrips: 0,
  },
  userGrowth: [],
  tripGrowth: [],
  tripsCategoryData: [],
  popularCities: [],
  topActivities: [],
  recentUsers: [],
};

export default function AdminPage() {
  const [data, setData] = useState<AnalyticsResponse>(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/admin/analytics");

        if (!response.ok) {
          throw new Error("Failed to load analytics");
        }

        setData(await response.json());
      } catch (err) {
        console.error("Admin analytics error:", err);
        setError("Could not load dashboard data from the database.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const {
    analyticsData,
    userGrowth,
    tripGrowth,
    tripsCategoryData,
    popularCities,
    topActivities,
    recentUsers,
  } = data;

  const stats = [
    {
      label: "Total Users",
      value: analyticsData.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Trips",
      value: analyticsData.totalTrips.toLocaleString(),
      icon: MapPin,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Active Trips",
      value: analyticsData.activeTrips.toLocaleString(),
      icon: Zap,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Tracked Budget",
      value: `$${analyticsData.totalBudget.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Card className="p-8 text-center text-gray-600">
            Loading live platform analytics...
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage and monitor your platform</p>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </Card>
        )}

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

        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Public Trips</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {analyticsData.publicTrips}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Budget per Trip</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                $
                {analyticsData.totalTrips
                  ? Math.round(
                      analyticsData.totalBudget / analyticsData.totalTrips,
                    ).toLocaleString()
                  : 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Recent Users Listed</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {recentUsers.length}
              </p>
            </div>
          </div>
        </Card>

        {/* Charts and Data */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            {/* User Growth Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">User Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#3b82f6" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Trip Creation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tripGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="trips" fill="#10b981" name="New Trips" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Trips by Category */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Activity Categories</h2>
              {tripsCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tripsCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tripsCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-600">
                  No activity categories yet. Add activities to trip stops to
                  see this chart.
                </p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            {/* Popular Cities */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Popular Cities</h2>
              <div className="space-y-3">
                {popularCities.length > 0 ? (
                  popularCities.map((city, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-900">
                        {city.city}
                      </span>
                      <span className="text-blue-600 font-bold">
                        {city.trips} trips
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No city stop data yet. Add stops to trips to populate this
                    list.
                  </p>
                )}
              </div>
            </Card>

            {/* Recent Users */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 text-sm font-semibold">
                        Name
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold">
                        Email
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold">
                        Join Date
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-semibold">
                        Trips
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-3 text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-900 font-semibold">
                          {user.trips}
                        </td>
                      </tr>
                    ))}
                    {recentUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-sm text-gray-600"
                        >
                          No users found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trips" className="space-y-4">
            {/* Top Activities */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Top Activities</h2>
              <div className="space-y-3">
                {topActivities.length > 0 ? (
                  topActivities.map((activity) => (
                    <div key={activity.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">
                          {activity.name}
                        </span>
                        <span className="text-blue-600 font-bold">
                          {activity.bookings}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (activity.bookings /
                                Math.max(
                                  ...topActivities.map((item) => item.bookings),
                                  1,
                                )) *
                                100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No activities found yet. Assign activities inside
                    itineraries to populate this list.
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
