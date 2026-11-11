import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Globe, ExternalLink, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies');
        const data = await res.json();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A]">Company Directory</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Discover and connect with the leading organizations and employers in Rwanda.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse shadow-sm" />)
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <div key={company.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0">
                    {company.logo ? <img src={company.logo} alt="" className="w-full h-full object-contain p-2" /> : <Building2 className="text-gray-300" size={32} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#0F172A]">{company.name}</h3>
                    <p className="text-sm text-gray-500">{company.industry}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-8 flex-grow">
                  {company.about || 'Leading organization operating in Rwanda, providing excellence in its sector and contributing to national development.'}
                </p>

                <div className="space-y-4 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{company.location || 'Rwanda'}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Globe size={16} />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        Visit Website <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                <Link 
                  to={`/find-jobs?companyId=${company.id}`}
                  className="mt-8 w-full py-3 bg-gray-50 group-hover:bg-[#2563EB] group-hover:text-white text-[#0F172A] font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  View Openings <ChevronRight size={18} />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full shadow-inner flex items-center justify-center mx-auto mb-6">
                <Building2 className="text-gray-200" size={32} />
              </div>
              <h2 className="text-xl font-bold">No companies registered yet</h2>
              <p className="text-gray-500">We are constantly adding new employers to our directory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
