"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [message, setMessage] = useState({
    name: "",
    email: "",
    content: "",
  });

  const submitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Message received.");
    setMessage({ name: "", email: "", content: "" });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-600">
          Send a note to the TravelLoop team.
        </p>

        <Card className="mt-6 p-6">
          <form onSubmit={submitMessage} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                value={message.name}
                onChange={(event) =>
                  setMessage({ ...message, name: event.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                value={message.email}
                onChange={(event) =>
                  setMessage({ ...message, email: event.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Message
              </label>
              <Textarea
                rows={6}
                value={message.content}
                onChange={(event) =>
                  setMessage({ ...message, content: event.target.value })
                }
                required
              />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
