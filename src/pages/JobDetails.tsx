import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, Clock, Building2, ChevronLeft, Share2, Facebook, Twitter, Link as LinkIcon, ExternalLink, Calendar, Users, Award, FileText, Bell } from 'lucide-react';
import { format } from 'date-fns';

export default function JobDetails() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const jobData = await res.json();
        setData(jobData);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading job details...</div>;
  if (!data) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Job not found.</div>;

  const { job, company, category, location, type, level } = data;

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out this job: ${job.title} at ${company.name} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header / Banner */}
      <div className="bg-[#0F172A] text-white pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/find-jobs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
            <ChevronLeft size={20} /> Back to Job List
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  {type}
                </span>
                <span className="text-gray-400 text-sm">Posted {format(new Date(job.publicationDate), 'MMMM dd, yyyy')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Building2 size={20} className="text-blue-500" />
                  <span className="font-semibold">{company.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-500" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
                <p className="text-sm text-gray-400 mb-1">Application Deadline</p>
                <div className="text-xl font-bold text-red-400 flex items-center gap-2">
                  <Clock size={20} />
                  {format(new Date(job.deadline), 'MMMM dd, yyyy')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                Job Description
              </h2>
              <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line">
                {job.description}
              </div>

              {job.responsibilities && (
                <>
                  <h3 className="text-xl font-bold mt-10 mb-4">Key Responsibilities</h3>
                  <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line">
                    {job.responsibilities}
                  </div>
                </>
              )}

              {job.requirements && (
                <>
                  <h3 className="text-xl font-bold mt-10 mb-4">Qualifications & Requirements</h3>
                  <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line">
                    {job.requirements}
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600">
                <Bell size={24} />
                Application Instructions
              </h2>
              <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-900 font-medium whitespace-pre-line mb-8">
                {job.applicationInstructions || 'Please follow the official application process as specified by the employer.'}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {job.applicationLink && (
                  <a 
                    href={job.applicationLink.includes('@') ? `mailto:${job.applicationLink}` : job.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2563EB] text-white font-bold rounded-2xl hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    Apply Directly to Employer <ExternalLink size={20} />
                  </a>
                )}
                <button 
                  onClick={shareOnWhatsApp}
                  className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  Share on WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold mb-6">Job Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date Posted</p>
                    <p className="text-sm font-semibold">{format(new Date(job.publicationDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Education Level</p>
                    <p className="text-sm font-semibold">{level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Experience</p>
                    <p className="text-sm font-semibold">{job.experience}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Vacancies</p>
                    <p className="text-sm font-semibold">{job.vacancies} Positions</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                    {company.logo ? <img src={company.logo} alt="" className="w-full h-full object-contain p-2" /> : <Building2 size={32} className="text-gray-300" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{company.name}</h4>
                    <p className="text-xs text-gray-500">{company.industry}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-6">
                  {company.about || 'Visit the official company profile for more information.'}
                </p>
                <Link to={`/companies/${company.id}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  View Company Profile
                </Link>
              </div>

              <div className="mt-10 pt-10 border-t border-gray-100 flex items-center justify-between">
                <button onClick={copyLink} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors" title="Copy Link">
                  <LinkIcon size={20} className="text-gray-600" />
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors" title="Share on Facebook">
                  <Facebook size={20} className="text-gray-600" />
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors" title="Share on Twitter">
                  <Twitter size={20} className="text-gray-600" />
                </button>
                <button onClick={shareOnWhatsApp} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors" title="Share on WhatsApp">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
