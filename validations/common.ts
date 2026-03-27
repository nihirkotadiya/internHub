import * as Yup from "yup";

export const emailField = Yup.string()
  .email("Please enter a valid email address")
  .required("Email is required");

export const passwordField = Yup.string()
  .min(6, "Password must be at least 6 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .required("Password is required");

export const contactNumberField = Yup.string()
  .matches(/^\d{10,15}$/, "Contact number must be 10–15 digits")
  .required("Contact number is required");

export const nameField = Yup.string()
  .min(2, "Name must be at least 2 characters")
  .required("Name is required");

export const dateField = (label = "Date") =>
  Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, `${label} must be a valid date`)
    .required(`${label} is required`);

export const optionalDateField = () =>
  Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (YYYY-MM-DD)")
    .nullable()
    .optional();
