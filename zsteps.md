# Creating models and Schemas

- Instal mongosse
  npm i mongoose

### Create schema

message
`const MessageSchema: Schema<Message> = new Schema({
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
`

## model

model (First check whether model exist or not second to create a model)

`const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
`

# create interface in TS

`export interface Message extends Document {
  content: string;
  createdAt: Date;
}`

# implementing ZOD

- create schemas

`import { z } from "zod"
export const userNameValidation = z
.string()
.min(2, "Username must be 2 character")
.max(20, "Username must be more than 20 character")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");
export const signUpSchema = z.object({
userName: userNameValidation,
email: z.string().email({ message: "Invalid Email Address" }),
password: z.string().min(6, { message: "Password must be 6 character" }),
});`

#DB COnnection

lib
dbConnect.ts

`import mongoose from "mongoose";
type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected ssucesfully");
  } catch (error) {
    console.log(" Database Connection failed", error);
    process.exit();
  }
}
export default dbConnect;
`
