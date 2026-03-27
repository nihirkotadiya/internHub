"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  const roleColor: Record<string, string> = {
    admin: "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30",
    manager: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30",
    intern: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
  };

  return (
    <nav className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 shadow-xl shadow-slate-900/20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">InternHub</span>
              <span className="hidden sm:block text-[10px] text-slate-500 -mt-1 font-medium tracking-widest uppercase">Management System</span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-semibold text-slate-100 leading-none">{session.user.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{session.user.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${roleColor[session.user.role || ""] || "bg-slate-700 text-slate-300"}`}>
                    {session.user.role}
                  </span>
                </div>

                <div className="w-px h-6 bg-slate-700 hidden sm:block" />

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/"
                className="btn btn-primary text-sm px-4 py-2 rounded-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
