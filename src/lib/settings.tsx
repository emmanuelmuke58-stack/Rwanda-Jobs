import React, { createContext, useContext, useEffect, useState } from 'react';

interface Settings {
  site_title: string;
  site_description: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  footer_text: string;
}

const defaultSettings: Settings = {
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
  footer_text: '© 2024 Rwanda Jobs. All rights reserved.'
};

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const newSettings = { ...defaultSettings };
          data.forEach((s: any) => {
            if (s.key in newSettings) {
              (newSettings as any)[s.key] = s.value;
            }
          });
          setSettings(newSettings);
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Apply primary color to CSS variables if needed
    document.documentElement.style.setProperty('--primary-color', settings.primary_color);
  }, [settings.primary_color]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
