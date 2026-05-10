import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <Card className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-4 leading-7 text-gray-600">
          TravelLoop stores account and trip information so you can plan and
          manage travel details. Keep sensitive travel documents outside the app
          unless you are comfortable storing them in your account.
        </p>
        <p className="mt-4 leading-7 text-gray-600">
          You control what you add, edit, and delete. Private trips remain tied
          to your account unless you choose to share them.
        </p>
      </Card>
    </main>
  );
}
