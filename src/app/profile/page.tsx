"use client";

import React, { useEffect, useState } from "react";
import { Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProfileState = {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Travel enthusiast planning the next great adventure.",
  });
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

  const updateProfile = (field: keyof ProfileState, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

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

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage the public details shown across your TravelLoop account.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="p-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <User size={42} />
            </div>
            <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">
              {profile.name}
            </h2>
            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{profile.location}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  value={profile.name}
                  onChange={(event) =>
                    updateProfile("name", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input type="email" value={profile.email} disabled />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  value={profile.phone}
                  onChange={(event) =>
                    updateProfile("phone", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location
                </label>
                <Input
                  value={profile.location}
                  onChange={(event) =>
                    updateProfile("location", event.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <Textarea
                  value={profile.bio}
                  rows={5}
                  onChange={(event) => updateProfile("bio", event.target.value)}
                />
              </div>
            </div>
            <Button className="mt-5">Save Profile</Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
