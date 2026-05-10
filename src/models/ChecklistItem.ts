import mongoose, { Schema, Document } from "mongoose";

export interface IChecklistItem extends Document {
  text: string;
  category: string;
  isCompleted: boolean;
  tripId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Please provide item text"],
    },
    category: {
      type: String,
      enum: [
        "documents",
        "clothing",
        "electronics",
        "toiletries",
        "medications",
        "misc",
      ],
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ChecklistItem ||
  mongoose.model<IChecklistItem>("ChecklistItem", ChecklistItemSchema);
