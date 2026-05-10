import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const topics = [
  "Creating and editing trips",
  "Managing budgets and checklists",
  "Planning itinerary stops",
  "Account and login support",
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="mt-2 text-gray-600">
            Find quick guidance for the most common TravelLoop workflows.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <Card key={topic} className="p-5">
              <h2 className="font-semibold text-gray-900">{topic}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Open your dashboard and use the matching section in the sidebar
                to continue.
              </p>
            </Card>
          ))}
        </div>
        <Link href="/dashboard">
          <Button>Open Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
