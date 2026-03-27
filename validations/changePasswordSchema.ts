import * as Yup from "yup";
import { passwordField } from "./common";

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: passwordField,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

export type ChangePasswordFormValues = Yup.InferType<typeof changePasswordSchema>;
