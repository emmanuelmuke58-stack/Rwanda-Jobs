import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, 
  Eye, CheckCircle2, XCircle, Star, Download, SlidersHorizontal, ChevronLeft, ChevronRight,
  Clock, Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import AdminJobForm from './JobForm.tsx';
import { TableSkeleton } from '../../components/ui/LoadingSkeletons.tsx';

export default function JobManagement() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, companiesRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/jobs'),
        fetch('/api/admin/companies'),
        fetch('/api/categories?type=job_category')
      ]);
      const jobsData = await jobsRes.json();
      const companiesData = await companiesRes.json();
      const categoriesData = await categoriesRes.json();

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Failed to fetch jobs data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (id: number) => companies.find(c => c.id === id)?.name || 'Unknown';
  const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'General';

  const filteredJobs = jobs.filter(job => {
    const title = job.title || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) setSelectedJobs([]);
    else setSelectedJobs(filteredJobs.map(j => j.id));
  };

  const toggleSelectJob = (id: number) => {
    if (selectedJobs.includes(id)) setSelectedJobs(selectedJobs.filter(sid => sid !== id));
    else setSelectedJobs([...selectedJobs, id]);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
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
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Job Management</h1>
          <p className="text-gray-500 font-medium">Create and manage your platform's job vacancies and publication statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={() => { setEditingJob(null); setIsFormOpen(true); }}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Plus size={20} /> Add New Job
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by job title or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Review</option>
            <option value="expired">Expired</option>
          </select>
          
          <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-gray-900 transition-colors">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <div className="bg-blue-600 p-4 rounded-2xl shadow-xl flex items-center justify-between text-white animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4">
            <span className="font-bold">{selectedJobs.length} Jobs Selected</span>
            <div className="h-6 w-[1px] bg-white/20"></div>
            <button className="text-sm font-bold hover:underline">Mark as Published</button>
            <button className="text-sm font-bold hover:underline">Mark as Featured</button>
            <button className="text-sm font-bold text-red-100 hover:text-white">Delete Selected</button>
          </div>
          <button onClick={() => setSelectedJobs([])} className="p-1 hover:bg-white/10 rounded-lg"><XCircle size={20}/></button>
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    checked={selectedJobs.length > 0 && selectedJobs.length === filteredJobs.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Job Details</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                <tr key={job.id} className={`hover:bg-gray-50/50 transition-colors ${selectedJobs.includes(job.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedJobs.includes(job.id)}
                      onChange={() => toggleSelectJob(job.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs ${job.isFeatured ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                        {job.isFeatured ? <Star size={14} fill="currentColor" /> : 'ID'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{job.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">REF-{job.id.toString().padStart(5, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-600">{getCompanyName(job.companyId)}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {getCategoryName(job.categoryId)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Clock size={14} className={new Date(job.deadline) < new Date() ? 'text-red-400' : 'text-gray-400'} />
                      {format(new Date(job.deadline), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      job.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 
                      job.status === 'draft' ? 'bg-gray-100 text-gray-400' :
                      job.status === 'expired' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        job.status === 'published' ? 'bg-emerald-500' : 
                        job.status === 'draft' ? 'bg-gray-400' :
                        job.status === 'expired' ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(job)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <Briefcase size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900">No jobs found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search keywords to find what you're looking for.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing 1 to {filteredJobs.length} of {filteredJobs.length} records</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white transition-all disabled:opacity-50" disabled><ChevronLeft size={18}/></button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 bg-blue-600 text-white rounded-lg font-black text-xs">1</button>
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white transition-all disabled:opacity-50" disabled><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <AdminJobForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            fetchData();
            setIsFormOpen(false);
          }}
          initialData={editingJob}
        />
      )}
    </div>
  );
}
