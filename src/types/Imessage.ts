import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
  feedback?: any;
}
// export type IMessage = {
//     content: string;
//   createdAt: Date;
//   feedback?: string;
// }

const MessageSchema: Schema<IMessage> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  feedback: { type: String, required: false },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
