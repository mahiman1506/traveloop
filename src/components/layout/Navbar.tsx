"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsOpen(false);
      router.push("/auth/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 font-bold text-2xl text-gray-950"
          >
            <Plane size={28} className="shrink-0" />
            <span className="truncate">TravelLoop</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/trips" className="hover:text-blue-600 transition">
              My Trips
            </Link>
            <Link href="/explore" className="hover:text-blue-600 transition">
              Explore
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Account</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/dashboard" className="block py-2 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/dashboard/trips" className="block py-2 hover:text-blue-600">
              My Trips
            </Link>
            <Link href="/explore" className="block py-2 hover:text-blue-600">
              Explore
            </Link>
            <Link href="/profile" className="block py-2 hover:text-blue-600">
              Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="block w-full py-2 text-left text-red-600 hover:text-red-700 disabled:opacity-60"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
