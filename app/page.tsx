"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik, FormikHelpers } from "formik";
import { loginSchema, LoginFormValues } from "@/validations/loginSchema";
import FormField from "@/components/ui/FormField";

const inputCls = "border border-slate-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all";
const inputErrCls = "border border-red-400 p-3 w-full rounded-lg focus:ring-2 focus:ring-red-400 outline-none transition-all";

export default function Login() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values: LoginFormValues, { setStatus, setSubmitting }: FormikHelpers<LoginFormValues>) => {
      setStatus("");
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        setStatus("Invalid email or password.");
      } else {
        router.push("/dashboard");
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {formik.status && (
          <p className="text-red-500 text-center mb-4 text-sm">{formik.status}</p>
        )}

        <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
          <FormField
            label="Email"
            id="email"
            error={formik.errors.email}
            touched={formik.touched.email}
          >
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="you@example.com"
              className={formik.touched.email && formik.errors.email ? inputErrCls : inputCls}
            />
          </FormField>

          <FormField
            label="Password"
            id="password"
            error={formik.errors.password}
            touched={formik.touched.password}
          >
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className={formik.touched.password && formik.errors.password ? inputErrCls : inputCls}
            />
          </FormField>

          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            className="bg-indigo-600 text-white w-full p-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-right mt-4">
          <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}