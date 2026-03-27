"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { changePasswordSchema } from "@/validations/changePasswordSchema";
import FormField from "@/components/ui/FormField";

function getInputCls(touched?: boolean, error?: string) {
  return `input-base${touched && error ? " error" : ""}`;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-sm font-medium min-h-[40px]">
        {value || <span className="text-slate-400 italic font-normal">Not specified</span>}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "", email: "", gender: "", college: "", contact_number: "",
    joining_date: "", date_of_birth: "", degree: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    else if (session?.user) {
      if (session.user.role !== "intern") router.push("/dashboard");
      else {
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
          body: JSON.stringify({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success");
          setTimeout(() => { setShowPasswordModal(false); resetForm(); }, 2000);
        } else { setStatus(data.error || "Failed to change password."); }
      } catch { setStatus("An error occurred."); }
      finally { setSubmitting(false); }
    },
  });

  if (status === "loading" || !session?.user || session.user.role !== "intern") return null;

  const initials = profileData.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-indigo-500/25">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{profileData.name}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{profileData.email}</p>
              <span className="badge badge-success mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                Active Intern
              </span>
            </div>
          </div>
          <button
            onClick={() => { setShowPasswordModal(true); pwdFormik.resetForm(); }}
            className="btn btn-secondary text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="card p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <ProfileField label="Gender" value={profileData.gender} />
          <ProfileField label="Contact Number" value={profileData.contact_number} />
          <ProfileField label="College / University" value={profileData.college} />
          <ProfileField label="Degree / Program" value={profileData.degree} />
          <ProfileField label="Date of Birth" value={profileData.date_of_birth ? new Date(profileData.date_of_birth).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : ""} />
          <ProfileField label="Joining Date" value={profileData.joining_date ? new Date(profileData.joining_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : ""} />
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => { setShowPasswordModal(false); pwdFormik.resetForm(); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
              </div>
              <button onClick={() => { setShowPasswordModal(false); pwdFormik.resetForm(); }} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              {pwdFormik.status === "success" ? (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm mb-4">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Password changed successfully!
                </div>
              ) : pwdFormik.status ? (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm mb-4">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {pwdFormik.status}
                </div>
              ) : null}

              <form onSubmit={pwdFormik.handleSubmit} noValidate className="space-y-4">
                {[
                  { id: "currentPassword", label: "Current Password" },
                  { id: "newPassword", label: "New Password" },
                  { id: "confirmPassword", label: "Confirm New Password" },
                ].map((f) => (
                  <FormField
                    key={f.id}
                    id={f.id} label={f.label}
                    error={(pwdFormik.errors as any)[f.id]}
                    touched={(pwdFormik.touched as any)[f.id]}
                    required
                  >
                    <input
                      id={f.id} type="password" name={f.id}
                      value={(pwdFormik.values as any)[f.id]}
                      onChange={pwdFormik.handleChange} onBlur={pwdFormik.handleBlur}
                      className={getInputCls((pwdFormik.touched as any)[f.id], (pwdFormik.errors as any)[f.id])}
                    />
                  </FormField>
                ))}

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => { setShowPasswordModal(false); pwdFormik.resetForm(); }} disabled={pwdFormik.isSubmitting} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={pwdFormik.isSubmitting || !pwdFormik.isValid || !pwdFormik.dirty} className="btn btn-primary">
                    {pwdFormik.isSubmitting ? (
                      <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Updating…</>
                    ) : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}