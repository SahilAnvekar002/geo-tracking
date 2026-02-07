import z from "zod";
import { roleLiterals, TRoleLiteral } from "../rbac";

export const createUserSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(8, "Minimum 8 charachters required"),
  firstName: z.string().min(2, "Firstname must have atleast 2 charachters"),
  lastName: z.string().min(2, "Lastname must have atleast 2 charachters"),
  role: z.array(
    z.enum([...roleLiterals] as unknown as readonly [TRoleLiteral]),
  ),
});

export const updateUserSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.optional(z.string().min(8, "Minimum 8 charachters required")),
  firstName: z.string().min(2, "Firstname must have atleast 2 charachters"),
  lastName: z.string().min(2, "Lastname must have atleast 2 charachters"),
  currentPassword: z.string().optional(),
  role: z.array(
    z.enum([...roleLiterals] as unknown as readonly [TRoleLiteral]),
  ),
});

export const registerUserSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(8, "Minimum 8 charachters required"),
  firstName: z.string().min(2, "Firstname must have atleast 2 charachters"),
  lastName: z.string().min(2, "Lastname must have atleast 2 charachters"),
});

export const signInUserSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(8, "Minimum 8 charachters required"),
});
