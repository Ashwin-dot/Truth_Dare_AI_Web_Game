import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters." })
    .max(300, { message: "Content must not be longer than 300 characters." }),
  feedback: z
    .string()
    .max(200, { message: "Feedback must not be longer than 200 characters." })
    .optional(), // Make feedback optional if it's not always required
});
