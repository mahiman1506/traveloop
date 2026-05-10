import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <Card className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-4 leading-7 text-gray-600">
          TravelLoop is a planning tool. You are responsible for verifying
          bookings, visas, health requirements, local laws, and travel changes
          before any trip.
        </p>
        <p className="mt-4 leading-7 text-gray-600">
          Use the app respectfully and only add information you have permission
          to store or share.
        </p>
      </Card>
    </main>
  );
}
