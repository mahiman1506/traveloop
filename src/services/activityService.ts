// Activity Service
export const activityService = {
  // Get activities
  getActivities: async (filters?: any) => {
    try {
      const query = new URLSearchParams();
      if (filters?.category) query.append("category", filters.category);
      if (filters?.city) query.append("city", filters.city);
      if (filters?.priceMin) query.append("priceMin", filters.priceMin);
      if (filters?.priceMax) query.append("priceMax", filters.priceMax);

      const response = await fetch(`/api/activities?${query.toString()}`);

      if (!response.ok) throw new Error("Failed to fetch activities");

      return await response.json();
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [];
    }
  },

  // Get activity details
  getActivityDetails: async (activityId: string) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`);

      if (!response.ok) throw new Error("Failed to fetch activity details");

      return await response.json();
    } catch (error) {
      console.error("Error fetching activity details:", error);
      return null;
    }
  },

  // Get activities by location
  getActivitiesByLocation: async (
    latitude: number,
    longitude: number,
    radius: number = 50,
  ) => {
    try {
      const response = await fetch(
        `/api/activities/location?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      );

      if (!response.ok) throw new Error("Failed to fetch activities");

      return await response.json();
    } catch (error) {
      console.error("Error fetching activities by location:", error);
      return [];
    }
  },

  // Search activities
  searchActivities: async (query: string) => {
    try {
      const response = await fetch(
        `/api/activities/search?q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) throw new Error("Failed to search activities");

      return await response.json();
    } catch (error) {
      console.error("Error searching activities:", error);
      return [];
    }
  },

  // Create activity
  createActivity: async (activity: any) => {
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      });

      if (!response.ok) throw new Error("Failed to create activity");

      return await response.json();
    } catch (error) {
      console.error("Error creating activity:", error);
      return null;
    }
  },
};
