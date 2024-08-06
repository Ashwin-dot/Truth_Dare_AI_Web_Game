import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be 2 character")
  .max(20, "Username must be more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(6, { message: "Password must be 6 character" }),
});
