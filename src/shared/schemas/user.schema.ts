import { z } from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.email(),
  address: z.object({
    street: z.string().min(1),
    suite: z.string().min(1),
    city: z.string().min(1),
    zipcode: z.string().min(1),
    geo: z.object({
      lat: z.string().min(1),
      lng: z.string().min(1),
    }),
  }),
  phone: z.string().min(1),
  website: z.string().min(1),
  company: z.object({
    name: z.string().min(1),
    catchPhrase: z.string().min(1),
    bs: z.string().min(1),
  }),
});

export const usersSchema = z.array(userSchema);

export const getUserByIdSchema = z.object({
  id: z.uuid(),
});

export type UserDto = z.infer<typeof userSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
