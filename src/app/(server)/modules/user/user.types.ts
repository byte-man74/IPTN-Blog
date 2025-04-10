import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.string().nullable(),
  isAdmin: z.boolean().default(false),
  isActive: z.boolean().optional(),
});

export const SecuredUserSchema = z.object({
    id: z.string(),
    email: z.string(),
})
export const CreateUserSchema = UserSchema.omit({
  id: true,
}).extend({
  password: z.string().refine(
    (password) => {
      const minLength = 6;
      // Require at least 2 of the following conditions
      let conditionsMet = 0;

      if (password.length >= minLength) conditionsMet++;
      if (/[A-Z]/.test(password)) conditionsMet++;
      if (/[a-z]/.test(password)) conditionsMet++;
      if (/\d/.test(password)) conditionsMet++;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) conditionsMet++;

      return conditionsMet >= 3;
    },
    {
      message: "Password must be at least 6 characters and satisfy at least 2 of the following: uppercase, lowercase, number, or special character"
    }
  ),
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
