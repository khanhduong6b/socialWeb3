import * as z from "zod";

export const PostValidation = z.object({
  content: z.string().min(1).max(200),
});
