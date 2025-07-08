import {z} from "zod"

export const message= z.object({
    content: z
    .string()
    .min(10,{message:"must be of 10 characters"})
    .max(300,{message:"content must be no longer than 300 characters"})
}) 