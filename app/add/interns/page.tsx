"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { internSchema } from "@/validations/internSchema";
import { managerSchema } from "@/validations/managerSchema";
import FormField from "@/components/ui/FormField";

const inputCls = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all";
const inputErrCls = "w-full px-4 py-2 border border-red-400 rounded-lg focus:ring-2 focus:ring-red-400 outline-none transition-all";
const inputDisabledCls = "w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 outline-none cursor-not-allowed";

function getInputCls(touched: boolean | undefined, error: string | undefined) {
  return touched && error ? inputErrCls : inputCls;
}

function page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<"manager" | "intern">("intern");
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [submitError, setSubmitError] = useState("");

  const isManager = session?.user?.role === "manager";
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (status === "loading") return;
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        if (data.departments) setDepartments(data.departments);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepartments();
  }, [status]);

  const initialDeptId = isManager && session?.user?.department_id
    ? String(session.user.department_id)
    : "";

  const internFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      contact_number: "",
      gender: "male",
      college: "",
      joining_date: new Date().toISOString().split("T")[0],
      date_of_birth: "",
      degree: "",
      department_id: initialDeptId || (departments[0]?.id?.toString() ?? ""),
    },
    validationSchema: internSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            role: "intern",
            department_id: isManager ? session?.user?.department_id : parseInt(values.department_id),
            gender: values.gender,
            college: values.college,
            date_of_birth: values.date_of_birth || null,
            degree: values.degree || null,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setSubmitError(data.error || "An error occurred");
        } else {
          resetForm();
          router.push("/interns?added=true");
        }
      } catch {
        setSubmitError("An unexpected error occurred.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const managerFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      contact_number: "",
      department_id: departments[0]?.id?.toString() ?? "",
    },
    validationSchema: managerSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            role: "manager",
            department_id: parseInt(values.department_id),
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setSubmitError(data.error || "An error occurred");
        } else {
          resetForm();
          router.push("/managers?added=true");
        }
      } catch {
        setSubmitError("An unexpected error occurred.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const role = isManager ? "intern" : roleTab;
  const formik = role === "intern" ? internFormik : managerFormik;
  const f = formik as any;

  return (
    <div>
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {submitError}
        </div>
      )}

      {isAdmin && (
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {(["intern", "manager"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRoleTab(r); setSubmitError(""); }}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${roleTab === r ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Add {r}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <FormField label="Full Name" id="name" error={f.errors.name} touched={f.touched.name}>
          <input
            type="text"
            name="name"
            value={f.values.name}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            placeholder="John Doe"
            className={getInputCls(f.touched.name, f.errors.name)}
          />
        </FormField>

        {/* Department */}
        <FormField label="Department" id="department_id" error={f.errors.department_id} touched={f.touched.department_id}>
          {isManager ? (
            <div className={inputDisabledCls}>
              {departments.find((d) => d.id === session?.user?.department_id)?.name || "Your Department"}
            </div>
          ) : (
            <select
              name="department_id"
              value={f.values.department_id}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              className={getInputCls(f.touched.department_id, f.errors.department_id)}
            >
              {departments.length === 0 && <option value="">Loading departments...</option>}
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          )}
        </FormField>

        {role === "intern" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Gender" id="gender" error={f.errors.gender} touched={f.touched.gender}>
              <select
                name="gender"
                value={f.values.gender}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
                className={getInputCls(f.touched.gender, f.errors.gender) + " bg-white"}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </FormField>

            <FormField label="Contact Number" id="contact_number" error={f.errors.contact_number} touched={f.touched.contact_number}>
              <input
                type="tel"
                name="contact_number"
                value={f.values.contact_number}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
                placeholder="1234567890"
                className={getInputCls(f.touched.contact_number, f.errors.contact_number)}
              />
            </FormField>

            <FormField label="College / University" id="college" error={f.errors.college} touched={f.touched.college}>
              <input
                type="text"
                name="college"
                value={f.values.college}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
                placeholder="State University"
                className={getInputCls(f.touched.college, f.errors.college)}
              />
            </FormField>

            <FormField label="Joining Date" id="joining_date" error={f.errors.joining_date} touched={f.touched.joining_date}>
              <input
                type="date"
                name="joining_date"
                value={f.values.joining_date}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
                className={getInputCls(f.touched.joining_date, f.errors.joining_date)}
              />
            </FormField>

            <FormField label="Date of Birth" id="date_of_birth" error={f.errors.date_of_birth} touched={f.touched.date_of_birth}>
              <input
                type="date"
                name="date_of_birth"
                value={f.values.date_of_birth}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
                className={getInputCls(f.touched.date_of_birth, f.errors.date_of_birth)}
              />
            </FormField>

            <FormField label="Degree / Program" id="degree" error={f.errors.degree} touched={f.touched.degree} className="col-span-2">
              <input
                type="text"
                name="degree"
                value={f.values.degree}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
                placeholder="e.g. B.Tech Computer Science"
                className={getInputCls(f.touched.degree, f.errors.degree)}
              />
            </FormField>
          </div>
        )}

        {role === "manager" && (
          <FormField label="Contact Number" id="contact_number" error={f.errors.contact_number} touched={f.touched.contact_number}>
            <input
              type="tel"
              name="contact_number"
              value={f.values.contact_number}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              placeholder="1234567890"
              className={getInputCls(f.touched.contact_number, f.errors.contact_number)}
            />
          </FormField>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email" id="email" error={f.errors.email} touched={f.touched.email}>
            <input
              type="email"
              name="email"
              value={f.values.email}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              placeholder="john@example.com"
              className={getInputCls(f.touched.email, f.errors.email)}
            />
          </FormField>

          <FormField label="Password" id="password" error={f.errors.password} touched={f.touched.password}>
            <input
              type="password"
              name="password"
              value={f.values.password}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              placeholder="••••••••"
              className={getInputCls(f.touched.password, f.errors.password)}
            />
          </FormField>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid || departments.length === 0}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center mt-6"
        >
          {formik.isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : `Add ${role === "intern" ? "Intern" : "Manager"}`}
        </button>
      </form>
    </div>
  );
}

export default page;