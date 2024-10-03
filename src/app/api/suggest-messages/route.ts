import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/model/User"; // Adjust the import path as needed
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { IMessage } from "@/types/Imessage";

const inference = new HfInference(
  process.env.HF_TOKEN || "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"
);

// Constants for managing retries and duplicate checking
const MAX_RETRIES = 5;

// Define the POST method
export async function POST(req: Request) {
  await mongoose.connect(process.env.MONGODB_URI as string);

  try {
    // Authenticate user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;

    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    const { type, category, feedback } = await req.json();

    // Validate required fields
    if (!type || !category) {
      return NextResponse.json(
        { message: "Invalid request: 'type' and 'category' are required." },
        { status: 400 }
      );
    }

    // Find the user by userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Define the prompt based on the game type
    const prompt = getPrompt(type, category);

    // Add the current prompt to messages with role "user"
    user.messages.push({
      content: prompt,
      createdAt: new Date(),
      feedback: feedback || "neutral",
    } as IMessage);

    // Prepare messages for the API call
    const messages = [
      { role: "system", content: "You are a truth or dare game assistant." },
      ...user.messages.flatMap((msg, index) => {
        return index % 2 === 0
          ? [{ role: "user", content: msg.content }]
          : [{ role: "assistant", content: msg.content }];
      }),
      { role: "user", content: prompt },
    ];

    // Function to get a unique response
    const getUniqueResponse = async (attempt = 0) => {
      let out = "";
      for await (const chunk of inference.chatCompletionStream({
        // model: "NousResearch/Hermes-3-Llama-3.1-8B",
        model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
        messages,
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 0.7,
      })) {
        if (
          chunk.choices &&
          chunk.choices[0].delta &&
          chunk.choices[0].delta.content
        ) {
          out += chunk.choices[0].delta.content;
        }
      }

      // Check if the response is a duplicate
      const isDuplicate = user.messages.some((msg) => msg.content === out);

      // If it's a duplicate and attempts are less than MAX_RETRIES, regenerate
      if (isDuplicate && attempt < MAX_RETRIES) {
        return await getUniqueResponse(attempt + 1);
      }

      return out;
    };

    // Get a unique response
    const uniqueResponse = await getUniqueResponse();

    // Save the unique response in the user's messages with role "assistant"
    user.messages.push({
      content: uniqueResponse,
      createdAt: new Date(),
      feedback: "neutral",
    } as IMessage);

    // Save updated user document to the database
    await user.save();

    return NextResponse.json({ message: uniqueResponse, success: true });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}

// Helper function to get prompt based on type and category
function getPrompt(type: string, category: string): string {
  return category === "Mix Category"
    ? type === "Truth"
      ? "Generate a new and random short one truth question that is suitable for a group setting across all age categories. The question should prompt participants to share experiences or opinions that can foster conversation among the group. Topics can include group dynamics, personal friendships, shared adventures, opinions about a group topic, or memories that involve others in the group."
      : "Generate a short one dare that is suitable for a group setting across all age categories. The dare should be interactive, requiring multiple participants to engage together. It could involve group tasks, teamwork challenges, performing a synchronized dance, or creative tasks that are fun, collaborative, and encourage bonding among the group."
    : category === "Hot and Spicy Category"
    ? type === "Truth"
      ? "Generate a new and random short only one truth question for a couple aged 18-35. The question should be intimate and engaging, covering topics such as past romantic experiences, hidden desires, future relationship goals, or personal secrets. Make it suitable for an adult couple, encouraging openness and deeper connection with perosnal question only."
      : "Generate short only one dare for a couple aged 18-35. The dare should be fun, adventurous, or intimate, encouraging closeness and excitement between the partners. It could involve romantic activities, playful challenges, or tasks that push their comfort zone in a positive way, ensuring it is appropriate for a couple in this age group with personl life."
    : category === "Truth and Dares for Boys Group"
    ? type === "Truth"
      ? "Generate a new and random short truth question for a group of boys. The question should be engaging and cover topics like sports, favorite series, experiences with girls, books, adult life challenges, family, entertainment, motivation, or personal achievements. Make it fun and thought-provoking, encouraging honesty and bonding within the group."
      : "Generate a new and random short dare for a group of boys. The dare should be entertaining and adventurous, relating to topics like sports, acting out scenes from favorite series, doing something funny about their experiences with girls, or challenges involving books, family, or motivational activities. Make it playful and suitable for fostering group dynamics and fun."
    : type === "Truth"
    ? "Generate a new and random short truth question for a group of girls. The question should cover topics like drama, favorite books, personal secrets, friendships, memorable experiences, and relationships. Make it engaging, fun, and suitable for encouraging open and honest conversations within the group."
    : "Generate a new and random short dare for a group of girls. The dare should be playful and adventurous, involving topics like reenacting dramatic scenes, sharing a secret in a creative way, or doing something related to their favorite books or movies. Make it entertaining and designed to foster laughter and group bonding.";
}
