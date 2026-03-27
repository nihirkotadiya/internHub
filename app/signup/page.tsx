"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Signup is disabled — only admins can create accounts
export default function SignupPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/"); }, [router]);
  return null;
}
