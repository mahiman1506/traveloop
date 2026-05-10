import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "How do I create a trip?",
    answer: "Open My Trips, choose New Trip, then enter the trip basics.",
  },
  {
    question: "Can I edit a trip after creating it?",
    answer: "Yes. Open the trip detail page and update the fields there.",
  },
  {
    question: "Where do budgets live?",
    answer: "Use the Budget section in the dashboard sidebar.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ</h1>
          <p className="mt-2 text-gray-600">
            Answers to common TravelLoop questions.
          </p>
        </div>
        {faqs.map((faq) => (
          <Card key={faq.question} className="p-5">
            <h2 className="font-semibold text-gray-900">{faq.question}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {faq.answer}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
