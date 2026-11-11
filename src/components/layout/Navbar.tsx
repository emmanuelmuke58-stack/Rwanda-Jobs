import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, FileText, Bell, Building2, Info, Phone, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../App.tsx';
import { useSettings } from '../../lib/settings.tsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { settings } = useSettings();

  const navLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Find Jobs', path: '/find-jobs', icon: Briefcase },
    { name: 'Companies', path: '/companies', icon: Building2 },
    { name: 'Tenders', path: '/tenders', icon: FileText },
    { name: 'Announcements', path: '/announcements', icon: Bell },
  ];

  const secondaryLinks = [
    { name: 'About Us', path: '/about', icon: null },
    { name: 'Contact Us', path: '/contact', icon: null },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg transition-colors"
                style={{ backgroundColor: settings.primary_color }}
              >
                {settings.site_title[0]}
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A] whitespace-nowrap">
                {settings.site_title}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(link.path) 
                      ? 'text-[#2563EB]' 
                      : 'text-gray-600 hover:text-[#2563EB]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-4 pr-4 border-r border-gray-200">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-gray-500 hover:text-[#2563EB] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {user ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0F172A] rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2563EB] transition-colors"
              >
                Admin Login
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.concat(secondaryLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-[#2563EB] bg-blue-50'
                    : 'text-gray-600 hover:text-[#2563EB] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#0F172A]"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
