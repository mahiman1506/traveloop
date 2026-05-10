"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Globe2, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProfileState = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  image: string;
  phone: string;
  city: string;
  country: string;
  additionalInfo: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({
    id: "",
    name: "",
    lastName: "",
    email: "",
    image: "",
    phone: "",
    city: "",
    country: "",
    additionalInfo: "",
    createdAt: "",
    updatedAt: "",
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
          id: data.user?.id ?? current.id,
          name: data.user?.name ?? "",
          lastName: data.user?.lastName ?? "",
          email: data.user?.email ?? "",
          image: data.user?.image ?? "",
          phone: data.user?.phone ?? "",
          city: data.user?.city ?? "",
          country: data.user?.country ?? "",
          additionalInfo: data.user?.additionalInfo ?? "",
          createdAt: data.user?.createdAt ?? "",
          updatedAt: data.user?.updatedAt ?? "",
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

  const fullName = [profile.name, profile.lastName].filter(Boolean).join(" ");
  const location = [profile.city, profile.country].filter(Boolean).join(", ");
  const accountDates = [
    {
      label: "Joined",
      value: profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString()
        : "Not available",
    },
    {
      label: "Last Updated",
      value: profile.updatedAt
        ? new Date(profile.updatedAt).toLocaleDateString()
        : "Not available",
    },
  ];

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
            {profile.image ? (
              <div
                className="mx-auto h-24 w-24 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${profile.image})` }}
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={42} />
              </div>
            )}
            <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">
              {fullName || "TravelLoop User"}
            </h2>
            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{profile.email || "No email saved"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{profile.phone || "No phone saved"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{location || "No location saved"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 size={16} />
                <span>{profile.country || "No country saved"}</span>
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
                  Last Name
                </label>
                <Input
                  value={profile.lastName}
                  onChange={(event) =>
                    updateProfile("lastName", event.target.value)
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
                  Profile Image URL
                </label>
                <Input value={profile.image} disabled />
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
                  City
                </label>
                <Input
                  value={profile.city}
                  onChange={(event) =>
                    updateProfile("city", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Country
                </label>
                <Input
                  value={profile.country}
                  onChange={(event) =>
                    updateProfile("country", event.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <Textarea
                  value={profile.additionalInfo}
                  rows={5}
                  onChange={(event) =>
                    updateProfile("additionalInfo", event.target.value)
                  }
                />
              </div>
            </div>
            <Button className="mt-5">Save Profile</Button>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Account Details
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">User ID</p>
              <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                {profile.id || "Not available"}
              </p>
            </div>
            {accountDates.map((item) => (
              <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <CalendarDays size={16} />
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
