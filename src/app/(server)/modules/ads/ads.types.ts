import { z } from "zod";

export const AdPositionEnum = z.enum(["HOME", "NAV", "SECOND", "THIRD", "FOURTH"]);

// ✅ Create Ad DTO
export const CreateAdSchema = z.object({
  mediaUrl: z.string().url({ message: "Invalid media URL" }),
  thumbnail: z.string().url({ message: "Invalid thumbnail URL" }),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  link: z.string().url({ message: "Invalid link" }).optional(),
  isActive: z.boolean().optional().default(true),
  position: AdPositionEnum.optional().default("HOME"),
  newsId: z.string().optional(),
});

// ✅ Edit Ad DTO (partial version of create)
export const EditAdSchema = CreateAdSchema.partial().extend({
  id: z.string().min(1, "Ad ID is required"),
});

// ✅ Read Ad DTO (for typing output, not validation input)
export const AdSchema = z.object({
  id: z.string(),
  mediaUrl: z.string(),
  thumbnail: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  link: z.string().nullable(),
  isActive: z.boolean(),
  position: AdPositionEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  newsId: z.string().nullable(),
});


export type AdsDTO =  z.infer<typeof AdSchema>
export type CreateAdDTO = z.infer<typeof CreateAdSchema>
export type EditAdDTO = z.infer<typeof EditAdSchema>
