"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { changePasswordSchema } from "@/validations/changePasswordSchema";
import FormField from "@/components/ui/FormField";

const disabledCls = "w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg outline-none cursor-not-allowed";
const inputErrCls = "w-full border border-red-400 p-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none";
const inputCls = "w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none";

function getInputCls(touched?: boolean, error?: string) {
  return touched && error ? inputErrCls : inputCls;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    gender: "",
    college: "",
    contact_number: "",
    joining_date: "",
    date_of_birth: "",
    degree: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session?.user) {
      if (session.user.role !== "intern") {
        router.push("/dashboard");
      } else {
        setProfileData({
          name: session.user.name || "",
          email: session.user.email || "",
          gender: session.user.gender || "",
          college: session.user.college || "",
          contact_number: session.user.contact_number || "",
          joining_date: session.user.joining_date || "",
          date_of_birth: (session.user as any).date_of_birth || "",
          degree: (session.user as any).degree || "",
        });
      }
    }
  }, [session, status]);

  const pwdFormik = useFormik({
    initialValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setStatus("");
      try {
        const res = await fetch("/api/users/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success");
          setTimeout(() => {
            setShowPasswordModal(false);
            resetForm();
          }, 2000);
        } else {
          setStatus(data.error || "Failed to change password.");
        }
      } catch {
        setStatus("An error occurred.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (status === "loading" || !session?.user || session.user.role !== "intern") return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200 sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold leading-6 text-slate-900">My Profile</h3>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button
            onClick={() => { setShowPasswordModal(true); pwdFormik.resetForm(); }}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Profile Card — all read-only */}
      <div className="bg-white shadow sm:rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" value={profileData.name} disabled className={disabledCls} />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" value={profileData.email} disabled className={disabledCls} />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <input type="text" value={profileData.gender} disabled className={disabledCls} />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">College / University</label>
              <input type="text" value={profileData.college} disabled className={disabledCls} />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
              <input type="text" value={profileData.contact_number} disabled className={disabledCls} />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Joining Date</label>
              <input type="date" value={profileData.joining_date} disabled className={disabledCls} />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input type="date" value={profileData.date_of_birth} disabled className={disabledCls} />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Degree / Program</label>
              <input type="text" value={profileData.degree} disabled placeholder="Not specified" className={disabledCls} />
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal with Formik */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm sm:max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">Change Password</h2>

            {pwdFormik.status === "success" ? (
              <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-800">
                Password changed successfully!
              </div>
            ) : pwdFormik.status ? (
              <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-800">
                {pwdFormik.status}
              </div>
            ) : null}

            <form onSubmit={pwdFormik.handleSubmit} noValidate className="space-y-4">
              <FormField id="currentPassword" label="Current Password" error={pwdFormik.errors.currentPassword} touched={pwdFormik.touched.currentPassword}>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={pwdFormik.values.currentPassword}
                  onChange={pwdFormik.handleChange}
                  onBlur={pwdFormik.handleBlur}
                  className={getInputCls(pwdFormik.touched.currentPassword, pwdFormik.errors.currentPassword)}
                />
              </FormField>

              <FormField id="newPassword" label="New Password" error={pwdFormik.errors.newPassword} touched={pwdFormik.touched.newPassword}>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={pwdFormik.values.newPassword}
                  onChange={pwdFormik.handleChange}
                  onBlur={pwdFormik.handleBlur}
                  className={getInputCls(pwdFormik.touched.newPassword, pwdFormik.errors.newPassword)}
                />
              </FormField>

              <FormField id="confirmPassword" label="Confirm New Password" error={pwdFormik.errors.confirmPassword} touched={pwdFormik.touched.confirmPassword}>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={pwdFormik.values.confirmPassword}
                  onChange={pwdFormik.handleChange}
                  onBlur={pwdFormik.handleBlur}
                  className={getInputCls(pwdFormik.touched.confirmPassword, pwdFormik.errors.confirmPassword)}
                />
              </FormField>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowPasswordModal(false); pwdFormik.resetForm(); }}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  disabled={pwdFormik.isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdFormik.isSubmitting || !pwdFormik.isValid || !pwdFormik.dirty}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {pwdFormik.isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}