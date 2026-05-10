import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  coverImage: string;
  userId: mongoose.Types.ObjectId;
  stops: Array<{
    city: string;
    country: string;
    startDate: Date;
    endDate: Date;
    description: string;
    activities: string[];
  }>;
  days: Array<{
    date: Date;
    activities: string[];
    notes?: string;
  }>;
  budget: {
    transportCost: number;
    hotelCost: number;
    activityCost: number;
    mealCost: number;
    miscCost: number;
  };
  activities: string[];
  isPublic: boolean;
  shareUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a trip title"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide an end date"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stops: [
      {
        city: String,
        country: String,
        startDate: Date,
        endDate: Date,
        description: String,
        activities: [String],
      },
    ],
    days: [
      {
        date: Date,
        activities: [String],
        notes: String,
      },
    ],
    budget: {
      transportCost: { type: Number, default: 0 },
      hotelCost: { type: Number, default: 0 },
      activityCost: { type: Number, default: 0 },
      mealCost: { type: Number, default: 0 },
      miscCost: { type: Number, default: 0 },
    },
    activities: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareUrl: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Trip ||
  mongoose.model<ITrip>("Trip", TripSchema);
