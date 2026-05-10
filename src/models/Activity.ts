import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  title: string;
  image: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  rating?: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an activity title"],
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: [
        "adventure",
        "cultural",
        "food",
        "entertainment",
        "sports",
        "nature",
        "shopping",
      ],
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: true, // in minutes
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);
