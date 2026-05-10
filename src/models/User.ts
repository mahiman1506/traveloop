import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  image?: string;
  phone?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    image: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    country: {
      type: String,
      default: "",
      trim: true,
    },
    additionalInfo: {
      type: String,
      default: "",
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function (password: string) {
  return await bcryptjs.compare(password, this.password);
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
