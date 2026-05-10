"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-blue-600"
          >
            <Plane size={28} />
            TravelLoop
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
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
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
          </div>
        )}
      </div>
    </nav>
  );
}
