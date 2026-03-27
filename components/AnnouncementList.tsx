"use client";

import { useEffect, useState } from "react";

interface User {
  name: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  created_by: string;
  created_by_role: string;
  department_id: number | null;
  created_at: string;
  user: User;
}

interface AnnouncementListProps {
  refreshTrigger: number;
}

export default function AnnouncementList({ refreshTrigger }: AnnouncementListProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/announcements");
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch announcements");
        }

        setAnnouncements(data.announcements);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p className="font-medium text-lg">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">No Announcements Yet</h3>
        <p className="text-slate-500">When new announcements are posted, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-slate-900">{announcement.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
              {new Date(announcement.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          
          <div className="mb-4 text-slate-700 whitespace-pre-wrap">
            {announcement.message}
          </div>
          
          <div className="flex items-center text-sm text-slate-500 pt-4 border-t border-slate-100">
            <div className="flex items-center mr-4">
              <span className="font-medium text-slate-700 mr-1">{announcement.user?.name || "Unknown"}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 uppercase tracking-wider ml-2">
                {announcement.created_by_role}
              </span>
            </div>
            {announcement.department_id === null ? (
              <span className="inline-flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs font-medium">
                Global
              </span>
            ) : (
              <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium">
                Department
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
