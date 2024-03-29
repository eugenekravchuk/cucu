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
    .optional()
    .transform((file) => file !== null && (file[0] as File))
    .refine((fileList) => {
      if (fileList?.length !== 1 && fileList) {
        return (
          fileList.length === 1 ||
          (fileList === null &&
            fileList[0].size <= MAX_FILE_SIZE_PROFILE &&
            ACCEPTED_IMAGE_TYPES.includes(fileList[0].type))
        );
      } else {
        return true; // Bypass checks if no file
      }
    }, "Expected file with size less than 2MB and valid type (.jpg, .jpeg, .png, .webp and mp4)"),
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
  bio: z.string().optional(),
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
  organization_name: z
    .string()
    .min(2, { message: "Minimum 2 characters." })
    .max(50, { message: "Maximum 50 caracters" }),
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
  organization_bio: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(400, { message: "Maximum 400 caracters" }),
});

// ============================================================
// EVENT
// ============================================================

export const EventValidation = z.object({
  event_text: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(50, { message: "Maximum 200 caracters" }),
  event_date: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(50, { message: "Maximum 200 caracters" }),
  category_id: z.string(),
  organization: z.string(),
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
});
