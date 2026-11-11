import React, { useEffect, useState } from 'react';
import { db } from '../../db/index.ts';
import { jobs, companies } from '../../db/schema.ts';
import { useAuth } from '../../App.tsx';
import { auth } from '../../lib/firebase.ts';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, Plus, Briefcase, FileText, Bell, Building2, LogOut, Search, MoreVertical, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'tenders' | 'announcements' | 'companies'>('jobs');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${activeTab === 'jobs' ? 'jobs' : activeTab}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] text-white flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">RJ</div>
          <span className="font-bold tracking-tight text-lg">Admin Console</span>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Briefcase size={20} />
            <span className="font-medium">Job Listings</span>
          </button>
          <button 
            onClick={() => setActiveTab('tenders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tenders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FileText size={20} />
            <span className="font-medium">Tenders</span>
          </button>
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'announcements' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Bell size={20} />
            <span className="font-medium">Announcements</span>
          </button>
          <button 
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'companies' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Building2 size={20} />
            <span className="font-medium">Companies</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6 p-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
              {user?.photoURL ? <img src={user.photoURL} alt="" /> : user?.email?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.email}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight capitalize">{activeTab} Management</h1>
              <p className="text-gray-500">Create, edit, and manage all your platform data in one place.</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} /> Add New {activeTab.slice(0, -1)}
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title={`Total ${activeTab}`} value={data.length} icon={Briefcase} color="blue" />
            <StatsCard title={`Active ${activeTab}`} value={data.length} icon={CheckCircle2} color="green" />
            <StatsCard title={`Pending Action`} value={0} icon={XCircle} color="amber" />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Edit2 size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Title / Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [1, 2, 3].map(i => <tr key={i}><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading data...</td></tr>)
                  ) : data.length > 0 ? (
                    data.map((item: any) => {
                      const entity = activeTab === 'jobs' ? item.jobs : item;
                      return (
                        <tr key={entity.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">
                                {entity.title?.[0] || 'A'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#0F172A] truncate">{entity.title}</p>
                                <p className="text-xs text-gray-500 truncate">{entity.category || 'General'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Published
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-700">{format(new Date(entity.publicationDate || entity.createdAt), 'MMM dd, yyyy')}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No {activeTab} found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Basic Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold tracking-tight">Add New {activeTab.slice(0, -1)}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><XCircle /></button>
            </div>
            
            <p className="text-gray-500">This is where the form to add a new {activeTab.slice(0, -1)} would go. In a production app, we would use react-hook-form with Zod validation here.</p>
            
            <div className="flex gap-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-100 text-[#0F172A] font-bold rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
              <button className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all">Save {activeTab.slice(0, -1)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}
