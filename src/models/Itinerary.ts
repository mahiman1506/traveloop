import mongoose, { Document, Schema } from "mongoose";

export interface IItinerary extends Document {
  userId: mongoose.Types.ObjectId;
  stops: Array<{
    id: string;
    city: string;
    country: string;
    startDate: Date;
    endDate: Date;
    activities: string[];
  }>;
  sections: Array<{
    id: string;
    title: string;
    details: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ItinerarySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    stops: [
      {
        id: { type: String, required: true },
        city: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        activities: { type: [String], default: [] },
      },
    ],
    sections: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        details: { type: String, default: "", trim: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Itinerary ||
  mongoose.model<IItinerary>("Itinerary", ItinerarySchema);
