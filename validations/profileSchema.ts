import * as Yup from "yup";
import { nameField, contactNumberField } from "./common";

export const profileSchema = Yup.object({
  name: nameField,
  contact_number: contactNumberField,
});

export type ProfileFormValues = Yup.InferType<typeof profileSchema>;
