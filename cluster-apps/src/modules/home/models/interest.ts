import z from "zod";

export const interestSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Interest name is required" }).max(50, { message: "Interest name must be less than 50 characters" }),
});

export type Interest = z.infer<typeof interestSchema>;
