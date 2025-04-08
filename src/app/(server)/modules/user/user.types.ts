import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  isAdmin: z.boolean().default(false),
  isActive: z.boolean(),
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


export const UpdateUserActivationSchema = z.object({
  email: z.string().email(),
  isActive: z.boolean()
});

export const AuthorizeUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type UpdateUserActivationDTO = z.infer<typeof UpdateUserActivationSchema>;
export type AuthorizeUserDTO = z.infer<typeof AuthorizeUserSchema>;
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UserDTO = z.infer<typeof UserSchema>;
export type SecuredUserInformationDTO = z.infer<typeof SecuredUserSchema>;
