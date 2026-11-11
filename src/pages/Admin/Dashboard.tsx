import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App.tsx';
import { auth } from '../../lib/firebase.ts';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, Briefcase, FileText, Bell, Building2, LogOut, 
  Settings, Shield, PieChart, Layers, Users, Globe, Image as ImageIcon,
  Activity, HelpCircle, ChevronRight, Menu, X, Search, BellRing
} from 'lucide-react';

// Sub-pages (We'll create these next)
import AdminOverview from './Overview.tsx';
import JobManagement from './JobManagement.tsx';
import CategoryManagement from './CategoryManagement.tsx';
import WebsiteSettings from './WebsiteSettings.tsx';
import TenderManagement from './TenderManagement.tsx';
import AnnouncementManagement from './AnnouncementManagement.tsx';
import CompanyManagement from './CompanyManagement.tsx';

export default function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuGroups = [
    {
      label: 'Main',
      items: [
        { id: 'overview', name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { id: 'analytics', name: 'Analytics', path: '/admin/analytics', icon: PieChart },
        { id: 'logs', name: 'Activity Logs', path: '/admin/logs', icon: Activity },
      ]
    },
    {
      label: 'Opportunities',
      items: [
        { id: 'jobs', name: 'Job Listings', path: '/admin/jobs', icon: Briefcase },
        { id: 'tenders', name: 'Tender Notices', path: '/admin/tenders', icon: FileText },
        { id: 'announcements', name: 'Announcements', path: '/admin/announcements', icon: Bell },
      ]
    },
    {
      label: 'Entities',
      items: [
        { id: 'companies', name: 'Companies', path: '/admin/companies', icon: Building2 },
        { id: 'categories', name: 'Categories', path: '/admin/categories', icon: Layers },
      ]
    },
    {
      label: 'Management',
      items: [
        { id: 'content', name: 'Pages & Content', path: '/admin/content', icon: Globe },
        { id: 'media', name: 'Media Library', path: '/admin/media', icon: ImageIcon },
        { id: 'settings', name: 'Website Settings', path: '/admin/settings', icon: Settings },
        { id: 'security', name: 'Security & Users', path: '/admin/security', icon: Shield },
      ]
    }
  ];

  const handleLogout = () => {
    signOut(auth);
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0F172A] text-white flex flex-col sticky top-0 h-screen transition-all duration-300 z-50`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">RJ</div>
            <span className="font-bold tracking-tight text-lg">Admin CMS</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h3 className={`text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 px-2 ${!isSidebarOpen && 'hidden'}`}>
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link 
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                      isActive(item.path) 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                    <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/5 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold uppercase">
              {user?.email?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.email}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            <span className={!isSidebarOpen ? 'hidden' : ''}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Global search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <BellRing size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
            <button className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors hidden sm:block">
                Super Admin
              </span>
            </button>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="tenders" element={<TenderManagement />} />
            <Route path="announcements" element={<AnnouncementManagement />} />
            <Route path="companies" element={<CompanyManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="settings" element={<WebsiteSettings />} />
            {/* Placeholder for others */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <HelpCircle size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Module Under Construction</h1>
                <p className="text-gray-500 max-w-md">This section of the Super Admin system is currently being developed to provide advanced management capabilities.</p>
                <Link to="/admin/dashboard" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">Return to Dashboard</Link>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}
