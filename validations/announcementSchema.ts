import * as Yup from "yup";

export const announcementSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters")
    .required("Title is required"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

export type AnnouncementFormValues = Yup.InferType<typeof announcementSchema>;
