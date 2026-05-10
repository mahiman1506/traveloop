import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  tripId: mongoose.Types.ObjectId;
  date: Date;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: [true, "Please provide a note title"],
    },
    content: {
      type: String,
      required: [true, "Please provide note content"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Note ||
  mongoose.model<INote>("Note", NoteSchema);
