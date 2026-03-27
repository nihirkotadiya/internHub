import * as Yup from "yup";
import { emailField, passwordField } from "./common";

export const loginSchema = Yup.object({
  email: emailField,
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type LoginFormValues = Yup.InferType<typeof loginSchema>;
