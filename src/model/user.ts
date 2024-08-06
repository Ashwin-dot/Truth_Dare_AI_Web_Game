import mongoose, { Schema, Document, model, Mongoose } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  createdAt: Date;
  messages: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is requires"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Enaim is requires"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email",
    ],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "VerifyCOde is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "VerifyCOde is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
