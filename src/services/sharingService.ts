// Trip Sharing Service
import { generateShareUrl } from "@/utils/helpers";

export const sharingService = {
  // Generate share link
  generateShareLink: async (tripId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to generate share link");

      const data = await response.json();
      return data.shareUrl || generateShareUrl(tripId);
    } catch (error) {
      console.error("Error generating share link:", error);
      return null;
    }
  },

  // Make trip public
  makePublic: async (tripId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: true }),
      });

      if (!response.ok) throw new Error("Failed to make trip public");

      return await response.json();
    } catch (error) {
      console.error("Error making trip public:", error);
      return null;
    }
  },

  // Make trip private
  makePrivate: async (tripId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: false }),
      });

      if (!response.ok) throw new Error("Failed to make trip private");

      return await response.json();
    } catch (error) {
      console.error("Error making trip private:", error);
      return null;
    }
  },

  // Share with specific users
  shareWithUsers: async (tripId: string, userIds: string[]) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/share-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });

      if (!response.ok) throw new Error("Failed to share trip");

      return await response.json();
    } catch (error) {
      console.error("Error sharing trip:", error);
      return null;
    }
  },

  // Get shared trips
  getSharedTrips: async () => {
    try {
      const response = await fetch("/api/trips/shared");

      if (!response.ok) throw new Error("Failed to fetch shared trips");

      return await response.json();
    } catch (error) {
      console.error("Error fetching shared trips:", error);
      return [];
    }
  },

  // Copy share link to clipboard
  copyShareLink: async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      return false;
    }
  },

  // Get shared trip details (public)
  getPublicTripDetails: async (shareUrl: string) => {
    try {
      const response = await fetch(`/api/shared-trips/${shareUrl}`);

      if (!response.ok) throw new Error("Failed to fetch trip details");

      return await response.json();
    } catch (error) {
      console.error("Error fetching trip details:", error);
      return null;
    }
  },
};
