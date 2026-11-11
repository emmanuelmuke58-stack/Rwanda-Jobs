import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, 
  FileText, CheckCircle2, XCircle, Download, SlidersHorizontal, ChevronLeft, ChevronRight,
  Clock, Building2
} from 'lucide-react';
import { format } from 'date-fns';
import TenderForm from './TenderForm.tsx';
import { TableSkeleton } from '../../components/ui/LoadingSkeletons.tsx';

export default function TenderManagement() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTenders, setSelectedTenders] = useState<number[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tendersRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/tenders'),
        fetch('/api/categories?type=tender_category')
      ]);
      const tendersData = await tendersRes.json();
      const categoriesData = await categoriesRes.json();

      setTenders(Array.isArray(tendersData) ? tendersData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Failed to fetch tenders data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'General';

  const filteredTenders = tenders.filter(tender => {
    const title = tender.title || '';
    const institution = tender.institution || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                         institution.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tender.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedTenders.length === filteredTenders.length) setSelectedTenders([]);
    else setSelectedTenders(filteredTenders.map(t => t.id));
  };

  const toggleSelectTender = (id: number) => {
    if (selectedTenders.includes(id)) setSelectedTenders(selectedTenders.filter(sid => sid !== id));
    else setSelectedTenders([...selectedTenders, id]);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tender? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/tenders/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (tender: any) => {
    setEditingTender(tender);
    setIsFormOpen(true);
  };

  if (loading) return <div className="space-y-8">
    <div className="h-20 bg-white rounded-3xl animate-pulse" />
    <TableSkeleton columns={7} rows={8} />
  </div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tender Management</h1>
          <p className="text-gray-500 font-medium">Manage procurement notices, bidding opportunities, and public tenders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={() => { setEditingTender(null); setIsFormOpen(true); }}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
          >
            <Plus size={20} /> Add New Tender
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by tender title or institution..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
            <option value="closed">Closed</option>
            <option value="awarded">Awarded</option>
          </select>
          
          <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-gray-900 transition-colors">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTenders.length > 0 && (
        <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl flex items-center justify-between text-white animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4">
            <span className="font-bold">{selectedTenders.length} Tenders Selected</span>
            <div className="h-6 w-[1px] bg-white/20"></div>
            <button className="text-sm font-bold hover:underline">Mark as Published</button>
            <button className="text-sm font-bold text-red-100 hover:text-white">Delete Selected</button>
          </div>
          <button onClick={() => setSelectedTenders([])} className="p-1 hover:bg-white/10 rounded-lg"><XCircle size={20}/></button>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={selectedTenders.length > 0 && selectedTenders.length === filteredTenders.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Tender Details</th>
                <th className="px-6 py-4">Institution</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTenders.length > 0 ? filteredTenders.map((tender) => (
                <tr key={tender.id} className={`hover:bg-gray-50/50 transition-colors ${selectedTenders.includes(tender.id) ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedTenders.includes(tender.id)}
                      onChange={() => toggleSelectTender(tender.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 font-black text-[10px]">
                        TND
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{tender.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{tender.referenceNumber || `REF-${tender.id}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-600">{tender.institution}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {getCategoryName(tender.categoryId)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Clock size={14} className={new Date(tender.deadline) < new Date() ? 'text-red-400' : 'text-gray-400'} />
                      {format(new Date(tender.deadline), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      tender.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 
                      tender.status === 'draft' ? 'bg-gray-100 text-gray-400' :
                      tender.status === 'expired' ? 'bg-red-50 text-red-500' : 
                      tender.status === 'closed' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        tender.status === 'published' ? 'bg-emerald-500' : 
                        tender.status === 'draft' ? 'bg-gray-400' :
                        tender.status === 'expired' ? 'bg-red-500' : 
                        tender.status === 'closed' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      {tender.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(tender)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tender.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <FileText size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900">No tenders found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search keywords.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <TenderForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            fetchData();
            setIsFormOpen(false);
          }}
          initialData={editingTender}
        />
      )}
    </div>
  );
}
