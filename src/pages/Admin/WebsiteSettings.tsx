import React, { useEffect, useState } from 'react';
import { 
  Save, Globe, Layout, Type, Palette, Search, 
  Share2, Mail, Phone, MapPin, ImageIcon, ExternalLink, RefreshCw
} from 'lucide-react';

export default function WebsiteSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState<any>({
    site_title: 'Rwanda Jobs & Opportunities',
    site_description: 'Connecting talent with opportunity in the Land of a Thousand Hills.',
    primary_color: '#2563EB',
    secondary_color: '#0F172A',
    contact_email: 'info@rwandajobs.rw',
    contact_phone: '+250 788 000 000',
    contact_address: 'Kigali Heights, 4th Floor',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    google_analytics_id: '',
    footer_text: '© 2024 Rwanda Jobs. All rights reserved.'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setSettings(data);
        const newForm = { ...formData };
        data.forEach((s: any) => {
          newForm[s.key] = s.value;
        });
        setFormData(newForm);
      } else {
        setSettings([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const promises = Object.keys(formData).map(key => 
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: formData[key].toString() })
        })
      );
      await Promise.all(promises);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaveLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'homepage', name: 'Homepage', icon: Layout },
    { id: 'contact', name: 'Contact Info', icon: Mail },
    { id: 'seo', name: 'SEO & Analytics', icon: Search },
    { id: 'social', name: 'Social Links', icon: Share2 },
  ];

  if (loading) return <div className="h-96 flex items-center justify-center"><RefreshCw className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Website Customization</h1>
          <p className="text-gray-500 font-medium">Control the public interface, branding, and global configuration of your platform.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation */}
        <aside className="lg:w-72 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-transparent'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} />
              <span>{tab.name}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 space-y-10">
              {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-gray-900">Global Settings</h2>
                    <p className="text-sm text-gray-500">Basic identification for your website across the web.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Website Name</label>
                      <input 
                        type="text" 
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                        value={formData.site_title}
                        onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Website Description</label>
                      <textarea 
                        rows={4}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                        value={formData.site_description}
                        onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-gray-900">Branding & Colors</h2>
                    <p className="text-sm text-gray-500">Customize the visual identity and brand presence.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700">Primary Brand Color</label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl shadow-inner border border-gray-100" style={{ backgroundColor: formData.primary_color }}></div>
                        <input 
                          type="text" 
                          className="flex-1 px-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700">Logo Management</label>
                      <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-blue-400 transition-colors">
                        <ImageIcon size={32} className="text-gray-400 group-hover:text-blue-500" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Upload New Logo</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-gray-900">Social Media Links</h2>
                    <p className="text-sm text-gray-500">Connect your platform with social profiles.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {['facebook_url', 'twitter_url', 'linkedin_url'].map(key => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 capitalize">{key.replace('_', ' ')}</label>
                        <input 
                          type="url" 
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="https://"
                          value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {!['general', 'appearance', 'social'].includes(activeTab) && (
                <div className="py-20 text-center space-y-4 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <Layout size={40} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 capitalize">{activeTab} Settings</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">This section is being wired to the database to allow full no-code control over your site's {activeTab}.</p>
                </div>
              )}
            </div>

            <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
              >
                {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                Confirm and Apply Changes
              </button>
            </div>
          </div>
          
          <div className="bg-blue-600 rounded-[32px] p-10 text-white flex items-center justify-between gap-10 shadow-2xl shadow-blue-500/20 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-20 -mt-20 rounded-full"></div>
             <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-black">Live Preview</h3>
                <p className="text-blue-100 font-medium max-w-md">Open the public site in a new tab to see how your changes look instantly after saving.</p>
             </div>
             <a href="/" target="_blank" className="relative z-10 px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 shrink-0">
                Launch Site <ExternalLink size={20} />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
