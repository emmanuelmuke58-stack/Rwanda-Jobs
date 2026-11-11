import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Building2, MapPin, Globe, Mail, Phone, Clock, Image as ImageIcon } from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  logo: z.string().optional().nullable(),
  industryId: z.coerce.number().min(1, 'Select an industry'),
  locationId: z.coerce.number().min(1, 'Select a location'),
  description: z.string().optional().nullable(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  email: z.string().email('Invalid email').optional().or(z.literal('')).nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

interface CompanyFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function CompanyForm({ onClose, onSuccess, initialData }: CompanyFormProps) {
  const [industries, setIndustries] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<any>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData ? {
      ...initialData,
      website: initialData.website || '',
      email: initialData.email || '',
    } : {
      isActive: true,
    }
  });

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const [ind, loc] = await Promise.all([
          fetch('/api/categories?type=industry'),
          fetch('/api/categories?type=location'),
        ]);
        
        const indData = await ind.json();
        const locData = await loc.json();

        setIndustries(Array.isArray(indData) ? indData : []);
        setLocations(Array.isArray(locData) ? locData : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchSelects();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/companies/${initialData.id}` : '/api/admin/companies';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save company');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">{initialData ? 'Edit Company Profile' : 'Register New Company'}</h2>
              <p className="text-sm text-gray-500 font-medium">Create and manage employer profiles on the platform.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Company Name</label>
              <input 
                {...register('name')}
                className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                placeholder="e.g. Bank of Kigali"
              />
              {errors.name && <p className="text-xs text-red-500 font-bold">{(errors.name as any).message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Industry</label>
              <select 
                {...register('industryId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              >
                <option value="">Select Industry</option>
                {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Headquarters Location</label>
              <select 
                {...register('locationId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              >
                <option value="">Select Location</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Website URL</label>
              <div className="relative">
                <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  {...register('website')}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  placeholder="https://www.bk.rw"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Contact Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  {...register('email')}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  placeholder="hr@company.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  {...register('phone')}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  placeholder="+250 7xx xxx xxx"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Logo URL</label>
              <div className="relative">
                <ImageIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  {...register('logo')}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest">About Company</label>
            <textarea 
              {...register('description')}
              rows={6}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="Briefly describe the company and its activities..."
            />
          </div>

          <div className="flex items-center gap-4">
            <input type="checkbox" {...register('isActive')} className="w-6 h-6 rounded-lg text-blue-600 border-gray-300 focus:ring-blue-500" />
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Active Status</label>
          </div>
        </form>

        <footer className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4 sticky bottom-0 rounded-b-[40px]">
          <button type="button" onClick={onClose} className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-all">Discard</button>
          <button 
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
            className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Clock className="animate-spin" size={20} /> : <Save size={20} />}
            {initialData ? 'Update Company' : 'Register Company'}
          </button>
        </footer>
      </div>
    </div>
  );
}
