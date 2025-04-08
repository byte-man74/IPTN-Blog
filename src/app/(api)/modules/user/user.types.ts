import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  isAdmin: z.boolean().default(false),
});

export const SecuredUserSchema = z.object({
    id: z.string(),
    email: z.string(),
    password: z.string()
})
export const CreateUserSchema = UserSchema.omit({
  id: true,
}).extend({
  password: z.string(),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UserDTO = z.infer<typeof UserSchema>;
export type SecuredUserInformationDTO = z.infer<typeof SecuredUserSchema>;
