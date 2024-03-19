import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  first_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  last_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const SigninValidation = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  // first_name: z
  //   .string()
  //   .min(2, { message: "Name must be at least 2 characters." }),
  // last_name: z
  //   .string()
  //   .min(2, { message: "Name must be at least 2 characters." }),
  // username: z
  //   .string()
  //   .min(2, { message: "Name must be at least 2 characters." }),
  // email: z.string().email(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
});
