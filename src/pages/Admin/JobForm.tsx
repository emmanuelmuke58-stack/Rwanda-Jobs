import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Briefcase, Building2, MapPin, Layers, GraduationCap, Clock, AlertCircle } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(5, 'Title is too short'),
  companyId: z.coerce.number().min(1, 'Select a company'),
  categoryId: z.coerce.number().min(1, 'Select a category'),
  locationId: z.coerce.number().min(1, 'Select a location'),
  employmentTypeId: z.coerce.number().min(1, 'Select employment type'),
  educationLevelId: z.coerce.number().min(1, 'Select education level'),
  experience: z.string().min(1, 'Experience is required'),
  vacancies: z.coerce.number().min(1).default(1),
  description: z.string().min(20, 'Description is too short'),
  responsibilities: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  applicationInstructions: z.string().optional().nullable(),
  applicationLink: z.string().optional().nullable(),
  deadline: z.string().min(1, 'Deadline is required'),
  status: z.enum(['published', 'draft', 'expired']).default('published'),
  isFeatured: z.boolean().default(false),
});

interface JobFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function JobForm({ onClose, onSuccess, initialData }: JobFormProps) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<any>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      companyId: initialData.companyId,
      categoryId: initialData.categoryId,
      locationId: initialData.locationId,
      employmentTypeId: initialData.employmentTypeId,
      educationLevelId: initialData.educationLevelId,
      experience: initialData.experience,
      vacancies: initialData.vacancies,
      description: initialData.description,
      responsibilities: initialData.responsibilities,
      requirements: initialData.requirements,
      applicationInstructions: initialData.applicationInstructions,
      applicationLink: initialData.applicationLink,
      deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
      status: initialData.status,
      isFeatured: initialData.isFeatured
    } : {
      vacancies: 1,
      status: 'published',
      isFeatured: false
    }
  });

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const [comp, cat, loc, typ, lev] = await Promise.all([
          fetch('/api/admin/companies'),
          fetch('/api/categories?type=job_category'),
          fetch('/api/categories?type=location'),
          fetch('/api/categories?type=employment_type'),
          fetch('/api/categories?type=education_level'),
        ]);
        
        const compData = await comp.json();
        const catData = await cat.json();
        const locData = await loc.json();
        const typData = await typ.json();
        const levData = await lev.json();

        setCompanies(Array.isArray(compData) ? compData : []);
        setCategories(Array.isArray(catData) ? catData : []);
        setLocations(Array.isArray(locData) ? locData : []);
        setTypes(Array.isArray(typData) ? typData : []);
        setLevels(Array.isArray(levData) ? levData : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSelects();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/jobs/${initialData.id}` : '/api/admin/jobs';
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
        alert(err.error || 'Failed to save job listing');
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
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">{initialData ? 'Edit Job Listing' : 'Publish New Vacancy'}</h2>
              <p className="text-sm text-gray-500 font-medium">Complete all required fields to list this opportunity.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Job Title</label>
              <input 
                {...register('title')}
                className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold ${errors.title ? 'ring-2 ring-red-500' : ''}`}
                placeholder="e.g. Senior Software Engineer"
              />
              {errors.title && <p className="text-xs text-red-500 font-bold">{(errors.title as any).message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Employer / Company</label>
              <select 
                {...register('companyId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              >
                <option value="">Select Employer</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.companyId && <p className="text-xs text-red-500 font-bold">{(errors.companyId as any).message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Job Category</label>
              <select 
                {...register('categoryId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500 font-bold">{(errors.categoryId as any).message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Location</label>
              <select 
                {...register('locationId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              >
                <option value="">Select Location</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Employment Type</label>
              <select 
                {...register('employmentTypeId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              >
                <option value="">Select Type</option>
                {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Education Level</label>
              <select 
                {...register('educationLevelId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              >
                <option value="">Select Level</option>
                {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Required Experience</label>
              <input 
                {...register('experience')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                placeholder="e.g. 3+ years in software dev"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Application Deadline</label>
              <input 
                type="date"
                {...register('deadline')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Job Description</label>
              <textarea 
                {...register('description')}
                rows={6}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                placeholder="Describe the role in detail..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Publication Status</label>
              <div className="flex gap-4">
                {(['published', 'draft', 'expired'] as const).map(s => (
                  <label key={s} className={`flex-1 flex items-center justify-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${watch('status') === s ? 'bg-blue-50 border-blue-500 text-blue-600 font-bold' : 'bg-gray-50 border-transparent text-gray-400 font-medium'}`}>
                    <input type="radio" {...register('status')} value={s} className="hidden" />
                    <span className="capitalize">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-8">
              <input type="checkbox" {...register('isFeatured')} className="w-6 h-6 rounded-lg text-blue-600 border-gray-300 focus:ring-blue-500" />
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Mark as Featured</label>
            </div>
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
            {initialData ? 'Update Job Listing' : 'Publish Opportunity'}
          </button>
        </footer>
      </div>
    </div>
  );
}
