import * as z from "zod";

export const UserValidation = z.object({
  imageURI: z.string().url().nonempty(),
  handle: z.string().min(2).max(50),
  name: z.string().min(3).max(30),
  bio: z.string().min(3).max(100),
});
