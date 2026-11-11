import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, FileText, Building2, MapPin, Layers, Clock, Link as LinkIcon, Info } from 'lucide-react';

const tenderSchema = z.object({
  title: z.string().min(10, 'Title is too short'),
  institution: z.string().min(2, 'Institution name is required'),
  referenceNumber: z.string().optional().nullable(),
  categoryId: z.coerce.number().min(1, 'Select a category'),
  locationId: z.coerce.number().min(1, 'Select a location'),
  description: z.string().min(20, 'Description is too short'),
  eligibilityRequirements: z.string().optional().nullable(),
  requiredDocuments: z.string().optional().nullable(),
  submissionInstructions: z.string().optional().nullable(),
  officialSourceLink: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  contactDetails: z.string().optional().nullable(),
  deadline: z.string().min(1, 'Deadline is required'),
  status: z.enum(['published', 'draft', 'expired', 'closed', 'awarded']).default('published'),
});

interface TenderFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function TenderForm({ onClose, onSuccess, initialData }: TenderFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<any>({
    resolver: zodResolver(tenderSchema),
    defaultValues: initialData ? {
      ...initialData,
      deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
      officialSourceLink: initialData.officialSourceLink || '',
    } : {
      status: 'published',
    }
  });

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const [cat, loc] = await Promise.all([
          fetch('/api/categories?type=tender_category'),
          fetch('/api/categories?type=location'),
        ]);
        
        const catData = await cat.json();
        const locData = await loc.json();

        setCategories(Array.isArray(catData) ? catData : []);
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
      const url = initialData ? `/api/admin/tenders/${initialData.id}` : '/api/admin/tenders';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          deadline: new Date(data.deadline).toISOString()
        })
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save tender');
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
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">{initialData ? 'Edit Tender Notice' : 'Post New Tender'}</h2>
              <p className="text-sm text-gray-500 font-medium">Publish procurement and bidding opportunities.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Tender Title</label>
              <input 
                {...register('title')}
                className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold ${errors.title ? 'ring-2 ring-red-500' : ''}`}
                placeholder="e.g. Supply and Delivery of Office Stationery"
              />
              {errors.title && <p className="text-xs text-red-500 font-bold">{(errors.title as any).message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Institution / Client</label>
              <input 
                {...register('institution')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                placeholder="e.g. Ministry of Infrastructure"
              />
              {errors.institution && <p className="text-xs text-red-500 font-bold">{(errors.institution as any).message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Reference Number</label>
              <input 
                {...register('referenceNumber')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                placeholder="e.g. 001/G/NCB/2024/MININFRA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Category</label>
              <select 
                {...register('categoryId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Location</label>
              <select 
                {...register('locationId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
              >
                <option value="">Select Location</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Submission Deadline</label>
              <input 
                type="date"
                {...register('deadline')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Description & Scope of Work</label>
              <textarea 
                {...register('description')}
                rows={6}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                placeholder="Provide details about the tender opportunity..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Eligibility Requirements</label>
                <textarea 
                  {...register('eligibilityRequirements')}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="Who is eligible to bid?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Submission Instructions</label>
                <textarea 
                  {...register('submissionInstructions')}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="How and where to submit bids?"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Official Source Link</label>
              <div className="relative">
                <LinkIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  {...register('officialSourceLink')}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                  placeholder="https://umucyo.gov.rw/..."
                />
              </div>
              {errors.officialSourceLink && <p className="text-xs text-red-500 font-bold">{(errors.officialSourceLink as any).message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Publication Status</label>
              <div className="flex flex-wrap gap-2">
                {(['published', 'draft', 'expired', 'closed', 'awarded'] as const).map(s => (
                  <label key={s} className={`flex-1 min-w-[100px] flex items-center justify-center p-3 rounded-xl cursor-pointer border-2 transition-all ${watch('status') === s ? 'bg-indigo-50 border-indigo-500 text-indigo-600 font-bold' : 'bg-gray-50 border-transparent text-gray-400 font-medium'}`}>
                    <input type="radio" {...register('status')} value={s} className="hidden" />
                    <span className="capitalize text-xs">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>

        <footer className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4 sticky bottom-0 rounded-b-[40px]">
          <button type="button" onClick={onClose} className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-all">Discard</button>
          <button 
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
            className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Clock className="animate-spin" size={20} /> : <Save size={20} />}
            {initialData ? 'Update Tender' : 'Publish Tender'}
          </button>
        </footer>
      </div>
    </div>
  );
}
