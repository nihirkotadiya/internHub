"use client";

import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { announcementSchema } from "@/validations/announcementSchema";
import FormField from "@/components/ui/FormField";

interface CreateAnnouncementFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const inputCls = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all";
const inputErrCls = "w-full px-4 py-2 border border-red-400 rounded-lg focus:ring-2 focus:ring-red-400 outline-none transition-all";

export default function CreateAnnouncementForm({ onSuccess, onClose }: CreateAnnouncementFormProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const formik = useFormik({
    initialValues: { title: "", message: "" },
    validationSchema: announcementSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus("");
      try {
        const res = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus(data.error || "Failed to create announcement");
          return;
        }
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 800);
      } catch {
        setStatus("An unexpected error occurred");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (userRole !== "admin" && userRole !== "manager") return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-slate-200 w-full max-w-lg mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Create {userRole === "admin" ? "Global" : "Department"} Announcement
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {formik.status && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
          {formik.status}
        </div>
      )}

      {formik.isSubmitting && !formik.status && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm font-medium border border-green-100">
          Announcement posted successfully!
        </div>
      )}

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <FormField label="Title" id="title" error={formik.errors.title} touched={formik.touched.title}>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Announcement Title"
            className={formik.touched.title && formik.errors.title ? inputErrCls : inputCls}
          />
        </FormField>

        <FormField label="Message" id="message" error={formik.errors.message} touched={formik.touched.message}>
          <textarea
            id="message"
            name="message"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            placeholder="Write your announcement here..."
            className={(formik.touched.message && formik.errors.message ? inputErrCls : inputCls) + " resize-none"}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {formik.isSubmitting ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {formik.isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
