import React, { useEffect, useState } from 'react';
import { Search, MapPin, FileText, ChevronRight, Filter, Clock, Building2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { TenderCardSkeleton } from '../components/ui/LoadingSkeletons.tsx';

export default function Tenders() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await fetch('/api/tenders');
        const data = await res.json();
        setTenders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch tenders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-[#0F172A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Tenders & Bidding Opportunities</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Find the latest public and private procurement notices in Rwanda.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search tenders by keyword..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-all">Filter Results</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [1, 2, 3, 4].map(i => <TenderCardSkeleton key={i} />)
          ) : tenders.length > 0 ? (
            tenders.map((tender) => (
              <div key={tender.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">Notice</span>
                  <span className="text-xs text-gray-400">Ref: {tender.referenceNumber || 'N/A'}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-2">{tender.title}</h3>
                <p className="text-gray-500 mb-8 flex items-center gap-2">
                  <Building2 size={18} className="text-gray-400" />
                  {tender.institution}
                </p>
                
                <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className={new Date(tender.deadline) < new Date() ? 'text-red-400' : 'text-gray-400'} />
                    <span className="text-gray-400">Deadline:</span>
                    <span className="font-bold text-red-500">{format(new Date(tender.deadline), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="text-[#2563EB] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Full Notice <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full shadow-inner flex items-center justify-center mx-auto mb-6">
                <FileText className="text-gray-200" size={32} />
              </div>
              <h2 className="text-xl font-bold">No tenders published yet</h2>
              <p className="text-gray-500">Please check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
