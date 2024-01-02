import z from "zod";

export const UserZodSchema = z.object({
  id: z.string({ required_error: "User id need be provided" }).optional(),
  email: z
    .string({ required_error: "Email need be provided" })
    .email(z.string({ required_error: "Email need be a valid email address" }))
    .min(3, { message: "Insert a valid email address" }),
  password: z
    .string({ required_error: "Password can't be empty" })
    .min(8, { message: "Password need be at least 8 characters" })
    .refine((pw) => /[0-9]/.test(pw), "Password must contain a number"),
});
