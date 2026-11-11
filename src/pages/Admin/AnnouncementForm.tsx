import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Bell, Layers, Clock, Link as LinkIcon } from 'lucide-react';

const announcementSchema = z.object({
  title: z.string().min(10, 'Title is too short'),
  categoryId: z.coerce.number().min(1, 'Select a category'),
  description: z.string().min(20, 'Description is too short'),
  officialSourceLink: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  publicationDate: z.string().optional().nullable(),
});

interface AnnouncementFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function AnnouncementForm({ onClose, onSuccess, initialData }: AnnouncementFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<any>({
    resolver: zodResolver(announcementSchema),
    defaultValues: initialData ? {
      ...initialData,
      publicationDate: initialData.publicationDate ? new Date(initialData.publicationDate).toISOString().split('T')[0] : '',
      officialSourceLink: initialData.officialSourceLink || '',
    } : {
      status: 'published',
      publicationDate: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const res = await fetch('/api/categories?type=announcement_category');
        const catData = await res.json();
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchSelects();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const url = initialData ? `/api/admin/announcements/${initialData.id}` : '/api/admin/announcements';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          publicationDate: data.publicationDate ? new Date(data.publicationDate).toISOString() : new Date().toISOString()
        })
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save announcement');
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
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Bell size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">{initialData ? 'Edit Announcement' : 'Post New Announcement'}</h2>
              <p className="text-sm text-gray-500 font-medium">Publish general announcements and public notices.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Announcement Title</label>
            <input 
              {...register('title')}
              className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all font-bold ${errors.title ? 'ring-2 ring-red-500' : ''}`}
              placeholder="e.g. Public Notice regarding New Tax Regulations"
            />
            {errors.title && <p className="text-xs text-red-500 font-bold">{(errors.title as any).message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Category</label>
              <select 
                {...register('categoryId')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all font-bold"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500 font-bold">{(errors.categoryId as any).message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Publication Date</label>
              <input 
                type="date"
                {...register('publicationDate')}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Description / Content</label>
            <textarea 
              {...register('description')}
              rows={8}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all font-medium"
              placeholder="Enter the full content of the announcement..."
            />
            {errors.description && <p className="text-xs text-red-500 font-bold">{(errors.description as any).message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Official Source Link (Optional)</label>
            <div className="relative">
              <LinkIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                {...register('officialSourceLink')}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all font-bold"
                placeholder="https://example.com/announcement"
              />
            </div>
            {errors.officialSourceLink && <p className="text-xs text-red-500 font-bold">{(errors.officialSourceLink as any).message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Status</label>
            <div className="flex gap-4">
              {(['published', 'draft', 'archived'] as const).map(s => (
                <label key={s} className={`flex-1 flex items-center justify-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${watch('status') === s ? 'bg-amber-50 border-amber-500 text-amber-600 font-bold' : 'bg-gray-50 border-transparent text-gray-400 font-medium'}`}>
                  <input type="radio" {...register('status')} value={s} className="hidden" />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        <footer className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4 sticky bottom-0 rounded-b-[40px]">
          <button type="button" onClick={onClose} className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-all">Discard</button>
          <button 
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
            className="px-10 py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Clock className="animate-spin" size={20} /> : <Save size={20} />}
            {initialData ? 'Update Announcement' : 'Publish Announcement'}
          </button>
        </footer>
      </div>
    </div>
  );
}
