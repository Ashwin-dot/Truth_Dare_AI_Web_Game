import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
  await dbConnect();

  // Get the session and user info
  const session = await getServerSession(authOptions);
  const _user: User | undefined = session?.user;

  // Check if the session is valid
  if (!session || !_user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    // Aggregate to get the user's messages with feedback
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    // Check if the user was found
    if (!user || user.length === 0) {
      return new Response(
        JSON.stringify({ message: "User not found", success: false }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the user's messages
    return new Response(
      JSON.stringify({ messages: user[0].messages, success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error", success: false }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
