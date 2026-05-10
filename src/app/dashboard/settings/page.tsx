"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function SettingsPage() {
  const router = useRouter();
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
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("traveloop-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldUseDark = savedTheme
      ? savedTheme === "dark"
      : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    setPreferences((current) => ({ ...current, darkMode: shouldUseDark }));
  }, []);

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
          id: data.user?.id ?? "",
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

  const toggleDarkMode = (enabled: boolean) => {
    setPreferences({
      ...preferences,
      darkMode: enabled,
    });
    document.documentElement.classList.toggle("dark", enabled);
    localStorage.setItem("traveloop-theme", enabled ? "dark" : "light");
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "This will permanently delete your account and all trips. This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setDeletingAccount(true);

    try {
      const response = await fetch("/api/auth/account", {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        alert(result.error || "Failed to delete account");
        return;
      }

      localStorage.removeItem("traveloop-theme");
      router.push("/auth/signup");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("An error occurred while deleting your account");
    } finally {
      setDeletingAccount(false);
    }
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 6 characters.",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      });

      const result = await response.json();

      if (!response.ok) {
        setPasswordStatus({
          type: "error",
          message: result.error || "Failed to change password.",
        });
        return;
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStatus({
        type: "success",
        message: result.message || "Password changed successfully.",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordStatus({
        type: "error",
        message: "An error occurred while changing your password.",
      });
    } finally {
      setChangingPassword(false);
    }
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

  const handleProfileChange = (field: keyof ProfileState, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "Not available";
  const updatedDate = profile.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString()
    : "Not available";

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
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  value={profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  value={profile.lastName}
                  onChange={(e) =>
                    handleProfileChange("lastName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input type="email" value={profile.email} disabled />
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo URL
              </label>
              <Input
                value={profile.image}
                onChange={(e) => handleProfileChange("image", e.target.value)}
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  value={profile.city}
                  onChange={(e) => handleProfileChange("city", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Input
                  value={profile.country}
                  onChange={(e) =>
                    handleProfileChange("country", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <Textarea
                value={profile.additionalInfo}
                onChange={(e) =>
                  handleProfileChange("additionalInfo", e.target.value)
                }
                rows={4}
              />
            </div>

            <div className="grid gap-4 border-t pt-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">User ID</p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                  {profile.id || "Not available"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">Joined</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {joinedDate}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">
                  Last Updated
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {updatedDate}
                </p>
              </div>
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
                  onChange={(e) => toggleDarkMode(e.target.checked)}
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
              <form className="space-y-3" onSubmit={changePassword}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: event.target.value,
                        })
                      }
                      minLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: event.target.value,
                        })
                      }
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                {passwordStatus && (
                  <p
                    className={`text-sm ${
                      passwordStatus.type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordStatus.message}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </Button>
              </form>
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
                onClick={deleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
