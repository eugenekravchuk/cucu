import * as z from "zod";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_SIZE_PROFILE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@ucu.edu.ua"), {
      message: "Email must be from the ucu.edu.ua domain",
    }),
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

export const UpdateProfileValidation = z.object({
  file: z
    .custom<FileList>()
    .refine((fileList) => fileList.length === 1, "Expected file")
    .transform((file) => file[0] as File)
    .refine((file) => {
      return file.size <= MAX_FILE_SIZE_PROFILE;
    }, `File size should be less than 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only these types are allowed .jpg, .jpeg, .png, .webp and mp4"
    ),
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
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  file: z
    .custom<FileList>()
    .optional()
    .refine((fileList) => {
      if (!fileList) return true;

      return fileList.length === 1;
    }, "Expected file")
    .transform((fileList) => {
      if (!fileList) return undefined;
      return fileList[0] as File;
    })
    .refine((file) => {
      if (!file) return true;

      return file.size <= MAX_FILE_SIZE;
    }, `File size should be less than 10MB.`)
    .refine((file) => {
      if (!file) return true;

      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only these types are allowed .jpg, .jpeg, .png, .webp and mp4"),
  isAnonymous: z.boolean().optional(),
});

// ============================================================
// ORGANISATION
// ============================================================

export const OrganisationValidation = z.object({
  description: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  photo: z
    .custom<FileList>()
    .optional()
    .refine((fileList) => {
      if (!fileList) return true;

      return fileList.length === 1;
    }, "Expected file")
    .transform((fileList) => {
      if (!fileList) return undefined;
      return fileList[0] as File;
    })
    .refine((file) => {
      if (!file) return true;

      return file.size <= MAX_FILE_SIZE;
    }, `File size should be less than 10MB.`)
    .refine((file) => {
      if (!file) return true;

      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only these types are allowed .jpg, .jpeg, .png, .webp and mp4"),

  name: z
    .string()
    .min(3, { message: "Minimum 5 characters." })
    .max(50, { message: "Maximum 50 caracters" }),
});
