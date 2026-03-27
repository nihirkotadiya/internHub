"use client";

import { useEffect, useState } from "react";

interface User { name: string; }
interface Announcement {
  id: string; title: string; message: string;
  created_by: string; created_by_role: string;
  department_id: number | null; created_at: string; user: User;
}

export default function AnnouncementList({ refreshTrigger }: { refreshTrigger: number }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true); setError("");
      try {
        const res = await fetch("/api/announcements");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch");
        setAnnouncements(data.announcements);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally { setLoading(false); }
    };
    fetchAnnouncements();
  }, [refreshTrigger]);

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-400 text-sm">Loading announcements…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="card p-5 flex items-start gap-3 border-red-100 bg-red-50">
      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <div>
        <p className="font-semibold text-red-700 mb-0.5">Error loading announcements</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    </div>
  );

  if (announcements.length === 0) return (
    <div className="card p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">No Announcements Yet</h3>
      <p className="text-slate-400 text-sm">Announcements posted by admins and managers appear here.</p>
    </div>
  );

  const roleColors: Record<string, string> = {
    admin: "badge-indigo",
    manager: "badge-amber",
  };

  return (
    <div className="space-y-4">
      {announcements.map((ann) => (
        <div key={ann.id} className="card p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-base font-semibold text-slate-900 leading-snug">{ann.title}</h3>
            <span className="badge badge-slate flex-shrink-0 mt-0.5">
              {new Date(ann.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-4">{ann.message}</p>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {ann.user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-semibold text-slate-700">{ann.user?.name || "Unknown"}</span>
              <span className={`badge ${roleColors[ann.created_by_role] || "badge-slate"}`}>
                {ann.created_by_role}
              </span>
            </div>
            <span className={`badge ${ann.department_id === null ? "badge-indigo" : "badge-success"}`}>
              {ann.department_id === null ? "🌐 Global" : "🏢 Department"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
