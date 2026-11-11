import React, { useEffect, useState } from 'react';
import { Bell, Search, ChevronRight, Calendar, ExternalLink, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import { AnnouncementCardSkeleton } from '../components/ui/LoadingSkeletons.tsx';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full -mr-40 -mt-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex p-3 bg-blue-600/20 rounded-2xl text-blue-400 mb-4 border border-blue-500/20">
            <Megaphone size={32} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Public Announcements & Notices</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Stay informed about government notices, scholarships, internships, and other important opportunities in Rwanda.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="space-y-6">
          {loading ? (
            [1, 2, 3].map(i => <AnnouncementCardSkeleton key={i} />)
          ) : announcements.length > 0 ? (
            announcements.map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100">
                        Notice
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Calendar size={14} />
                        {format(new Date(item.publicationDate), 'MMMM dd, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-3">
                    {item.officialSourceLink && (
                      <a 
                        href={item.officialSourceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors"
                        title="Official Link"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                    <button className="px-6 py-3 bg-gray-50 group-hover:bg-[#2563EB] group-hover:text-white text-[#0F172A] font-bold rounded-xl transition-all flex items-center gap-2">
                      Read More <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white py-20 rounded-3xl border border-dashed border-gray-200 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="text-gray-200" size={32} />
              </div>
              <h2 className="text-xl font-bold">No announcements at the moment</h2>
              <p className="text-gray-500 px-10">We regularly post new scholarship, training, and recruitment announcements. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
