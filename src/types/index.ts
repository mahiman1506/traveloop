// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Trip Types
export interface Stop {
  _id: string;
  city: string;
  country: string;
  startDate: Date;
  endDate: Date;
  description: string;
  activities: string[]; // Array of activity IDs
}

export interface Activity {
  _id: string;
  title: string;
  image: string;
  category: string;
  price: number;
  duration: number; // in minutes
  description: string;
  rating?: number;
}

export interface Day {
  _id: string;
  date: Date;
  activities: Activity[];
  notes?: string;
}

export interface Budget {
  transportCost: number;
  hotelCost: number;
  activityCost: number;
  mealCost: number;
  miscCost: number;
}

export interface Trip {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  coverImage: string;
  userId: string;
  stops: Stop[];
  days: Day[];
  budget: Budget;
  activities: Activity[];
  isPublic: boolean;
  shareUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Checklist Types
export interface ChecklistItem {
  _id: string;
  text: string;
  category: string;
  isCompleted: boolean;
  tripId: string;
}

// Notes Types
export interface Note {
  _id: string;
  tripId: string;
  date: Date;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface Analytics {
  totalUsers: number;
  totalTrips: number;
  mostPlannedTrips: Trip[];
  popularActivities: Activity[];
  popularCities: string[];
}
