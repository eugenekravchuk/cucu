import * as z from "zod";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "data:image/png;base64",
];

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  first_name: z
    .string()
    .min(2, { message: "Ім'я повинно складатись принаймні з 2 символів." }),
  last_name: z
    .string()
    .min(2, { message: "Ім'я повинно складатись принаймні з 2 символів." }),
  username: z
    .string()
    .min(2, { message: "Ім'я повинно складатись принаймні з 2 символів." }),
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@ucu.edu.ua"), {
      message: "Електронна пошта повинна бути з домену ucu.edu.ua",
    }),
  password: z
    .string()
    .min(8, { message: "Пароль повинен складатись принаймні з 8 символів." }),
});

export const SigninValidation = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Пароль повинен складатись принаймні з 8 символів." }),
});

export const UpdateProfileValidation = z.object({
  file: z
    .custom<FileList>()
    .optional()
    .transform((file) => file !== null && (file[0] as File))
    .refine((file) => {
      if (file && file !== "h") {
        return file.size <= MAX_FILE_SIZE;
      } else {
        return true;
      }
    }, "Очікується файл розміром менше 10 МБ"),
  first_name: z
    .string()
    .min(2, { message: "Ім'я повинно складатись принаймні з 2 символів." }),
  last_name: z
    .string()
    .min(2, { message: "Ім'я повинно складатись принаймні з 2 символів." }),
  username: z
    .string()
    .min(2, { message: "Ім'я повинно складатись принаймні з 2 символів." }),
  email: z.string().email(),
  bio: z.string().optional(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Мінімум 5 символів." })
    .max(500, { message: "Максимум 500 символів." }),
  file: z
    .custom<FileList>()
    .optional()
    .refine((fileList) => {
      if (!fileList) return true;

      return fileList.length === 1;
    }, "Очікується файл.")
    .transform((fileList) => {
      if (!fileList) return undefined;
      return fileList[0] as File;
    })
    .refine((file) => {
      if (!file || file === undefined) return true;

      return file.size <= MAX_FILE_SIZE;
    }, "Розмір файлу повинен бути меншим за 10 MБ.")
    .refine((file) => {
      if (!file) return true;

      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Дозволені лише такі типи: .jpg, .jpeg, .png, .webp."),
  isAnonymous: z.boolean().optional(),
});

// ============================================================
// ORGANISATION
// ============================================================

export const OrganisationValidation = z.object({
  organization_name: z
    .string()
    .min(2, { message: "Мінімум 2 символи." })
    .max(50, { message: "Максимум 50 символів." }),
  photo: z
    .custom<FileList>()
    .optional()
    .refine((fileList) => {
      if (!fileList) return true;

      return fileList.length === 1;
    }, "Очікується файл.")
    .transform((fileList) => {
      if (!fileList) return undefined;
      return fileList[0] as File;
    })
    .refine((file) => {
      if (!file) return true;

      return file.size <= MAX_FILE_SIZE;
    }, "Розмір файлу повинен бути меншим за 10 MБ.")
    .refine((file) => {
      if (!file) return true;

      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Дозволені лише такі типи: .jpg, .jpeg, .png, .webp ."),
  organization_bio: z
    .string()
    .min(5, { message: "Мінімум 5 символів." })
    .max(400, { message: "Максимум 400 символів." }),
});

// ============================================================
// EVENT
// ============================================================

export const EventValidation = z.object({
  event_text: z
    .string()
    .min(5, { message: "Мінімум 5 символів." })
    .max(50, { message: "Максимум 200 символів." }),
  event_date: z.date(),
  category_id: z.string(),
  organization: z.string(),
  photo: z
    .custom<FileList>()
    .optional()
    .refine((fileList) => {
      if (!fileList) return true;

      return fileList.length === 1;
    }, "Очікується файл.")
    .transform((fileList) => {
      if (!fileList) return undefined;
      return fileList[0] as File;
    })
    .refine((file) => {
      if (!file) return true;

      return file.size <= MAX_FILE_SIZE;
    }, "Розмір файлу повинен бути меншим за 10 MБ.")
    .refine((file) => {
      if (!file) return true;

      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Дозволені лише такі типи: .jpg, .jpeg, .png, .webp"),
});
