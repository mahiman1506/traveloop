"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    photo: "",
    phone: "+1 (555) 123-4567",
    bio: "Travel enthusiast exploring the world",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: "English",
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    shareTrips: true,
    allowMessages: true,
  });
  const [savedDestinations, setSavedDestinations] = useState([
    "Tokyo, Japan",
    "Barcelona, Spain",
    "Goa, India",
  ]);
  const [destinationDraft, setDestinationDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setIsLoggedIn(false);
          return;
        }

        const data = await response.json();
        setProfile((current) => ({
          ...current,
          name: data.user?.name ?? current.name,
          email: data.user?.email ?? current.email,
        }));
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <Card className="p-8 text-center text-gray-600">
            Loading profile...
          </Card>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Please log in to view your profile
            </h1>
            <p className="mt-2 text-gray-600">
              We could not find an active login session.
            </p>
            <Link href="/auth/login">
              <Button className="mt-5">Go to Login</Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input type="email" value={profile.email} disabled />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo URL
              </label>
              <Input
                value={profile.photo}
                onChange={(e) => handleProfileChange("photo", e.target.value)}
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <Textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                rows={4}
              />
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card className="p-6 space-y-4">
            <div className="flex gap-2">
              <Input
                value={destinationDraft}
                onChange={(event) => setDestinationDraft(event.target.value)}
                placeholder="Save a destination"
              />
              <Button
                onClick={() => {
                  if (!destinationDraft.trim()) {
                    return;
                  }
                  setSavedDestinations([
                    ...savedDestinations,
                    destinationDraft.trim(),
                  ]);
                  setDestinationDraft("");
                }}
              >
                Add
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {savedDestinations.map((destination) => (
                <div
                  key={destination}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                >
                  <span className="font-medium text-gray-900">
                    {destination}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSavedDestinations(
                        savedDestinations.filter((item) => item !== destination),
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Receive trip updates via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    emailNotifications: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Push Notifications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Receive push notifications on your device
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      pushNotifications: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Dark Mode</h3>
                  <p className="text-sm text-gray-600">
                    Use dark mode for the interface
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.darkMode}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      darkMode: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) =>
                  setPreferences({ ...preferences, language: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 w-full">
              Save Preferences
            </Button>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Visibility
              </label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) =>
                  setPrivacy({ ...privacy, profileVisibility: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Share Trips</h3>
                  <p className="text-sm text-gray-600">
                    Allow others to see your trips
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.shareTrips}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, shareTrips: e.target.checked })
                  }
                  className="w-5 h-5"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Allow Messages
                  </h3>
                  <p className="text-sm text-gray-600">
                    Allow others to send you messages
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.allowMessages}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, allowMessages: e.target.checked })
                  }
                  className="w-5 h-5"
                />
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 w-full">
              Save Privacy Settings
            </Button>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Password</h3>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Two-Factor Authentication
              </h3>
              <Button variant="outline" className="w-full">
                Enable 2FA
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Active Sessions
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage your active sessions across devices
              </p>
              <Button variant="outline" className="w-full">
                View All Sessions
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Delete Account
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all data
              </p>
              <Button
                variant="outline"
                className="w-full text-red-600 hover:text-red-700"
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
