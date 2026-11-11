import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  Building2, Globe, Mail, Phone, MapPin, 
  CheckCircle2, XCircle, Download, ExternalLink
} from 'lucide-react';
import CompanyForm from './CompanyForm.tsx';
import { CompanyCardSkeleton } from '../../components/ui/LoadingSkeletons.tsx';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/companies'); // Using public API since it includes joined data
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const name = company.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this company? This will affect all associated jobs.')) return;
    try {
      const res = await fetch(`/api/admin/companies/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (company: any) => {
    // Need to fetch full company data including IDs for the form
    fetch(`/api/admin/companies`)
      .then(res => res.json())
      .then(data => {
        const fullData = data.find((c: any) => c.id === company.id);
        setEditingCompany(fullData);
        setIsFormOpen(true);
      });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Company Management</h1>
          <p className="text-gray-500 font-medium">Manage employer profiles, logos, and contact information.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingCompany(null); setIsFormOpen(true); }}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Plus size={20} /> Add New Company
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by company name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <CompanyCardSkeleton key={i} />)
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group overflow-hidden flex flex-col">
              <div className="p-8 space-y-6 flex-1">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100 group-hover:scale-105 transition-transform">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="text-gray-300" size={32} />
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(company)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(company.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{company.industry || 'General Industry'}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <MapPin size={16} className="text-blue-500" />
                    {company.location || 'Rwanda'}
                  </div>
                  {company.email && (
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                      <Mail size={16} className="text-blue-500" />
                      {company.email}
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                      <Phone size={16} className="text-blue-500" />
                      {company.phone}
                    </div>
                  )}
                </div>
              </div>

              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-xs font-black text-gray-500 uppercase tracking-widest flex items-center justify-between hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  Visit Website
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Building2 size={40} />
            </div>
            <h3 className="font-bold text-gray-900 text-xl">No companies found</h3>
            <p className="text-gray-500">Try adding a new employer to get started.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <CompanyForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            fetchData();
            setIsFormOpen(false);
          }}
          initialData={editingCompany}
        />
      )}
    </div>
  );
}
