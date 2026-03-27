"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { loginSchema } from "@/validations/loginSchema";
import FormField from "@/components/ui/FormField";

export default function Login() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus("");
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        setStatus("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">InternHub</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
              <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
            </div>

            {formik.status && (
              <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formik.status}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
              <FormField label="Email Address" id="email" error={formik.errors.email} touched={formik.touched.email}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="you@company.com"
                  className={`input-base ${formik.touched.email && formik.errors.email ? "error" : ""}`}
                />
              </FormField>

              <FormField label="Password" id="password" error={formik.errors.password} touched={formik.touched.password}>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={`input-base ${formik.touched.password && formik.errors.password ? "error" : ""}`}
                />
              </FormField>

              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
                className="btn btn-primary w-full py-2.5 text-sm font-semibold mt-2 rounded-xl"
              >
                {formik.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            InternHub Management System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}