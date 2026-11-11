import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronRight, FileText, Bell, TrendingUp, Building2, GraduationCap, Laptop, Stethoscope, Landmark, Sprout, Hammer, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useSettings } from '../lib/settings.tsx';
import { JobCardSkeleton, TenderCardSkeleton } from '../components/ui/LoadingSkeletons.tsx';

export default function Home() {
  const { settings } = useSettings();
  const [latestJobs, setLatestJobs] = useState<any[]>([]);
  const [latestTenders, setLatestTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, tendersRes, catsRes] = await Promise.all([
          fetch('/api/jobs?limit=6'),
          fetch('/api/tenders?limit=4'),
          fetch('/api/categories?type=job_category')
        ]);
        const jobsData = await jobsRes.json();
        const tendersData = await tendersRes.json();
        const catsData = await catsRes.json();
        
        setLatestJobs(Array.isArray(jobsData) ? jobsData : []);
        setLatestTenders(Array.isArray(tendersData) ? tendersData : []);
        // Add icons manually for known categories
        const iconMap: any = {
          'Administration': Landmark,
          'Accounting & Finance': TrendingUp,
          'Engineering': Hammer,
          'Information Tech': Laptop,
          'Healthcare': Stethoscope,
          'Education': GraduationCap,
          'Agriculture': Sprout,
          'Security': Shield
        };
        const validCats = Array.isArray(catsData) ? catsData : [];
        setCategories(validCats.map((c: any) => ({
          ...c,
          icon: iconMap[c.name] || Briefcase,
          count: Math.floor(Math.random() * 50) + 5 // Mock count for now
        })));
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/rwandan_modern_office_hero_1794389460012.jpg" 
            alt="Modern office in Kigali" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight font-display">
              Discover Job Opportunities <br />
              <span style={{ color: settings.primary_color }}>Across Rwanda</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              {settings.site_description}
            </p>
            
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Search className="text-gray-400 shrink-0" size={20} />
                <input 
                  type="text" 
                  placeholder="Job title or keyword" 
                  className="bg-transparent border-none focus:ring-0 text-[#0F172A] w-full"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="text-gray-400 shrink-0" size={20} />
                <input 
                  type="text" 
                  placeholder="Location (e.g. Kigali)" 
                  className="bg-transparent border-none focus:ring-0 text-[#0F172A] w-full"
                />
              </div>
              <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                Search Jobs
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <span className="text-sm text-gray-400">Popular:</span>
              {['Engineering', 'Healthcare', 'Finance', 'Education'].map(tag => (
                <Link key={tag} to={`/find-jobs?category=${tag}`} className="text-sm font-medium hover:text-[#3B82F6] transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Latest Job Opportunities</h2>
            <p className="text-gray-500">Discover recently published vacancies from top employers.</p>
          </div>
          <Link to="/find-jobs" className="text-[#2563EB] font-semibold flex items-center gap-1 group">
            Browse All Jobs <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestJobs.length > 0 ? (
            latestJobs.map((item) => (
              <JobCard key={item.job.id} job={item.job} company={item.company} category={item.category} location={item.location_name} type={item.type_name} />
            ))
          ) : (
            // Mock empty state for initial build
            [1, 2, 3, 4, 5, 6].map(i => <JobCardSkeleton key={i} />)
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Browse Jobs by Category</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Select a category that fits your expertise and find your next dream job.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/find-jobs?categoryId=${cat.id}`}
                className="group p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-center"
              >
                <div className="inline-flex p-4 rounded-xl bg-white text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors mb-6 shadow-sm">
                  <cat.icon size={32} />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count} Vacancies</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tenders Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl -mr-20 -mt-20 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white">Latest Tenders & Bidding</h2>
              <p className="text-gray-400">Discover public and private procurement opportunities in Rwanda.</p>
            </div>
            <Link to="/tenders" className="px-6 py-3 bg-white text-[#0F172A] font-bold rounded-xl hover:bg-gray-100 transition-colors">
              View All Tenders
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {latestTenders.length > 0 ? (
              latestTenders.map(tender => (
                <TenderCard key={tender.id} tender={tender} dark />
              ))
            ) : (
              [1, 2].map(i => <TenderCardSkeleton key={i} />)
            )}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-400 tracking-widest uppercase text-xs mb-4">Trusted by Leading Organizations</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            {/* Mock logos */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center gap-2 font-bold text-xl text-gray-400">
                <Building2 size={24} />
                <span>COMPANY {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function JobCard({ job, company, category, location, type }: any) {
  return (
    <Link to={`/jobs/${job.id}`} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-50">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
          ) : (
            <Building2 className="text-gray-300" size={28} />
          )}
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
          {type}
        </span>
      </div>
      
      <div className="space-y-2 mb-6">
        <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">{job.title}</h3>
        <p className="text-sm text-gray-500 font-medium">{company.name}</p>
      </div>
      
      <div className="mt-auto space-y-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            {location}
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-gray-400" />
            {category.name}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
            Deadline: {format(new Date(job.deadline), 'MMM dd, yyyy')}
          </span>
          <div className="text-[#2563EB] text-sm font-bold flex items-center gap-1">
            View Details <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function TenderCard({ tender, dark = false }: any) {
  return (
    <div className={`p-6 rounded-2xl border ${dark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'} transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] uppercase tracking-widest font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
          {tender.category || 'Procurement'}
        </span>
        <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          Ref: {tender.referenceNumber || 'N/A'}
        </span>
      </div>
      <h3 className={`font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-[#0F172A]'}`}>{tender.title}</h3>
      <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{tender.institution}</p>
      
      <div className={`pt-4 border-t ${dark ? 'border-white/5' : 'border-gray-50'} flex justify-between items-center`}>
        <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          Deadline: <span className="font-bold">{format(new Date(tender.deadline), 'MMM dd, yyyy')}</span>
        </div>
        <Link 
          to={`/tenders/${tender.id}`}
          className={`text-sm font-bold flex items-center gap-1 ${dark ? 'text-white hover:text-blue-400' : 'text-[#2563EB] hover:text-blue-700'} transition-colors`}
        >
          View Notice <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

