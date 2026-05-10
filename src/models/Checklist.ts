import mongoose, { Document, Schema } from "mongoose";

export interface IChecklist extends Document {
  userId: mongoose.Types.ObjectId;
  items: Array<{
    id: string;
    text: string;
    category: string;
    completed: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true, trim: true },
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
          default: "misc",
        },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Checklist ||
  mongoose.model<IChecklist>("Checklist", ChecklistSchema);
