import React, { useEffect, useState } from 'react';
import { Search, MapPin, Briefcase, ChevronRight, Filter, X, SlidersHorizontal, GraduationCap, Clock, Building2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

export default function FindJobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Administration', 'Accounting & Finance', 'Engineering', 'Information Tech', 'Healthcare', 'Education', 'Agriculture', 'Security', 'NGO', 'Government', 'Private'];
  const types = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Volunteer'];
  const levels = ['Primary', 'Secondary / A2', 'Diploma / A1', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams).toString();
        const res = await fetch(`/api/jobs?${query}`);
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchParams]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-72 space-y-8 ${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setShowFilters(false)}><X /></button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Job title, keywords..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={searchParams.get('search') || ''}
                  onChange={(e) => updateParam('search', e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">Location</h3>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="District or city"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={searchParams.get('location') || ''}
                  onChange={(e) => updateParam('location', e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">Category</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 group cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={searchParams.get('category') === cat}
                      onChange={() => updateParam('category', searchParams.get('category') === cat ? '' : cat)}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">Employment Type</h3>
              <div className="space-y-2">
                {types.map(type => (
                  <label key={type} className="flex items-center gap-2 group cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={searchParams.get('type') === type}
                      onChange={() => updateParam('type', searchParams.get('type') === type ? '' : type)}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full py-2 text-sm font-medium text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h1 className="font-bold text-lg">
              {loading ? 'Searching...' : `${jobs.length} Job Opportunities Found`}
            </h1>
            <button 
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
              Sort by: 
              <select className="border-none bg-transparent font-bold text-[#0F172A] focus:ring-0 outline-none cursor-pointer">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Closing Soon</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => <JobListItemSkeleton key={i} />)
            ) : jobs.length > 0 ? (
              jobs.map((item) => (
                <JobListItem key={item.jobs.id} job={item.jobs} company={item.companies} />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="text-gray-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
                <button onClick={clearFilters} className="mt-6 text-[#2563EB] font-bold">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobListItem({ job, company }: any) {
  return (
    <Link to={`/jobs/${job.id}`} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col md:flex-row gap-6">
      <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-50 shrink-0">
        {company.logo ? (
          <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
        ) : (
          <Building2 className="text-gray-300" size={32} />
        )}
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-xl text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{job.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-gray-700">{company.name}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500">{job.category}</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
            {job.employmentType}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap size={16} className="text-gray-400" />
            {job.educationLevel}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-gray-400" />
            Expires: {format(new Date(job.deadline), 'MMM dd, yyyy')}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col justify-between items-end">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          Posted {format(new Date(job.publicationDate), 'MMM dd')}
        </span>
        <div className="px-6 py-2 bg-gray-50 text-[#0F172A] text-sm font-bold rounded-xl group-hover:bg-[#2563EB] group-hover:text-white transition-all">
          View Details
        </div>
      </div>
    </Link>
  );
}

function JobListItemSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse flex flex-col md:flex-row gap-6">
      <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="h-6 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-4 bg-gray-100 rounded w-24" />
        </div>
      </div>
      <div className="w-32 h-10 bg-gray-100 rounded-xl self-end" />
    </div>
  );
}
