import * as z from "zod";
// 1. ZOD SCHEMA: Menyesuaikan dengan CreateEventDTO di Backend
export const createEventSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters.").max(255),
    description: z.string().min(1, "Description is required."),
    location: z.string().min(1, "Location is required."),
    price: z.number().min(0, "Price cannot be negative."),
    totalSeats: z.number().min(1, "Total seats must be at least 1."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    image: z.instanceof(File, { message: "Event banner image is required." }),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CreateEventSchema = z.infer<typeof createEventSchema>;
