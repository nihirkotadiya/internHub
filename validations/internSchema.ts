import * as Yup from "yup";
import { nameField, emailField, passwordField, contactNumberField, dateField, optionalDateField } from "./common";

export const internSchema = Yup.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  contact_number: contactNumberField,
  gender: Yup.string().oneOf(["male", "female"], "Please select a gender").required("Gender is required"),
  college: Yup.string().required("College / University is required"),
  joining_date: dateField("Joining date"),
  date_of_birth: optionalDateField(),
  degree: Yup.string().optional(),
  department_id: Yup.string().required("Department is required"),
});

export type InternFormValues = Yup.InferType<typeof internSchema>;
