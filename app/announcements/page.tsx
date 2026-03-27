"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CreateAnnouncementForm from "@/components/CreateAnnouncementForm";
import AnnouncementList from "@/components/AnnouncementList";

export default function AnnouncementsPage() {
  const { data: session } = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => setRefreshTrigger((prev) => prev + 1);
  const canCreate = session?.user?.role === "admin" || session?.user?.role === "manager";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Stay up to date with the latest news and updates</p>
        </div>
        {canCreate && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Announcement
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <CreateAnnouncementForm onSuccess={handleSuccess} onClose={() => setIsModalOpen(false)} />
        </div>
      )}

      <AnnouncementList refreshTrigger={refreshTrigger} />
    </div>
  );
}
