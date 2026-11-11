import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, MoreVertical, Edit2, Trash2, 
  Bell, Download, SlidersHorizontal, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import AnnouncementForm from './AnnouncementForm.tsx';
import { TableSkeleton } from '../../components/ui/LoadingSkeletons.tsx';

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [annRes, catRes] = await Promise.all([
        fetch('/api/admin/announcements'),
        fetch('/api/categories?type=announcement_category')
      ]);
      const annData = await annRes.json();
      const catData = await catRes.json();

      setAnnouncements(Array.isArray(annData) ? annData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'General';

  const filteredAnnouncements = announcements.filter(ann => {
    const title = ann.title || '';
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (ann: any) => {
    setEditingAnnouncement(ann);
    setIsFormOpen(true);
  };

  if (loading) return <div className="space-y-8">
    <div className="h-20 bg-white rounded-3xl animate-pulse" />
    <TableSkeleton columns={5} rows={6} />
  </div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Announcement Management</h1>
          <p className="text-gray-500 font-medium">Manage platform announcements, news, and public notices.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingAnnouncement(null); setIsFormOpen(true); }}
            className="px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <Plus size={20} /> Add New Announcement
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Announcement</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Publication Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAnnouncements.length > 0 ? filteredAnnouncements.map((ann) => (
                <tr key={ann.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <Bell size={14} />
                      </div>
                      <p className="font-bold text-gray-800 text-sm truncate max-w-xs">{ann.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {getCategoryName(ann.categoryId)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Clock size={14} className="text-gray-400" />
                      {ann.publicationDate ? format(new Date(ann.publicationDate), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ann.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 
                      ann.status === 'draft' ? 'bg-gray-100 text-gray-400' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {ann.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(ann)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ann.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <Bell size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900">No announcements found</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <AnnouncementForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            fetchData();
            setIsFormOpen(false);
          }}
          initialData={editingAnnouncement}
        />
      )}
    </div>
  );
}
