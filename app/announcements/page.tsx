"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CreateAnnouncementForm from "@/components/CreateAnnouncementForm";
import AnnouncementList from "@/components/AnnouncementList";

export default function AnnouncementsPage() {
  const { data: session } = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const userRole = session?.user?.role;
  const canCreate = userRole === "admin" || userRole === "manager";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Announcements</h1>
        </div>
        
        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Announcement
          </button>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <CreateAnnouncementForm 
            onSuccess={handleSuccess} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      )}
      
      <AnnouncementList refreshTrigger={refreshTrigger} />
    </div>
  );
}
