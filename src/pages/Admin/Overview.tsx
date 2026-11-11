import React, { useEffect, useState } from 'react';
import { 
  Briefcase, FileText, Bell, Building2, TrendingUp, Users, Eye, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes, logsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/jobs?limit=5'),
          fetch('/api/admin/logs?limit=10')
        ]);
        
        const statsData = await statsRes.json();
        const jobsData = await jobsRes.json();
        const logsData = await logsRes.json();

        setStats(statsData);
        setRecentJobs(Array.isArray(jobsData) ? jobsData : []);
        setRecentLogs(Array.isArray(logsData) ? logsData : []);
      } catch (err) {
        console.error('Failed to fetch overview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-96 bg-white rounded-3xl border border-gray-100" />
      <div className="h-96 bg-white rounded-3xl border border-gray-100" />
    </div>
  </div>;

  return (
    <div className="space-y-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 font-medium">Welcome back! Here's what's happening on your platform today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Job Listings" 
          value={stats?.totalJobs} 
          icon={Briefcase} 
          trend="+12%" 
          color="blue" 
        />
        <StatCard 
          title="Active Tenders" 
          value={stats?.activeTenders} 
          icon={FileText} 
          trend="+5%" 
          color="emerald" 
        />
        <StatCard 
          title="Registered Companies" 
          value={stats?.totalCompanies} 
          icon={Building2} 
          trend="+2%" 
          color="amber" 
        />
        <StatCard 
          title="Monthly Page Views" 
          value={stats?.monthlyPageViews?.toLocaleString()} 
          icon={Eye} 
          trend="+24%" 
          color="indigo" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Jobs Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Job Publications</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 text-sm">{job.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        job.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">
                      {format(new Date(job.publicationDate), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">System Activity</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {recentLogs.length > 0 ? recentLogs.map((log) => (
              <div key={log.id} className="flex gap-4 group">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Clock size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-800">
                    {log.adminName} <span className="font-medium text-gray-500">{log.action}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {format(new Date(log.timestamp), 'hh:mm a · MMM dd')}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-400 text-sm py-10 italic">No activity logs recorded yet.</p>
            )}
          </div>
          <div className="p-4 bg-gray-50/50 text-center">
            <button className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">View Security Logs</button>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryItem 
          title="Active vs Expired" 
          value={`${stats?.activeJobs || 0} / ${(stats?.totalJobs || 0) - (stats?.activeJobs || 0)}`} 
          label="Vacancy Ratio" 
          icon={TrendingUp} 
          color="blue" 
        />
        <SummaryItem 
          title="Announcements" 
          value={stats?.totalAnnouncements || 0} 
          label="Published Notices" 
          icon={Bell} 
          color="emerald" 
        />
        <SummaryItem 
          title="Platform Security" 
          value="Healthy" 
          label="SSL & Database Status" 
          icon={CheckCircle2} 
          color="indigo" 
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} /> {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value || 0}</p>
      </div>
    </div>
  );
}

function SummaryItem({ title, value, label, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-gray-900">{value}</span>
          <span className="text-[10px] font-bold text-gray-400">{label}</span>
        </div>
      </div>
    </div>
  );
}
