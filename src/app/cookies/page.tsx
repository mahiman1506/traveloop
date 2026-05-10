import { Card } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <Card className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
        <p className="mt-4 leading-7 text-gray-600">
          TravelLoop uses essential cookies for authentication and session
          behavior. These cookies help keep you logged in and connect your
          browser to your account.
        </p>
      </Card>
    </main>
  );
}
