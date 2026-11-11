import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Twitter, Linkedin, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                RJ
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Rwanda Jobs
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              The premier platform for job vacancies, tenders, and public announcements across Rwanda. Connecting talent with opportunity since 2024.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/find-jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Browse Companies</Link></li>
              <li><Link to="/tenders" className="hover:text-white transition-colors">Tenders & Bidding</Link></li>
              <li><Link to="/announcements" className="hover:text-white transition-colors">Public Announcements</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Job Categories</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/find-jobs?category=Government" className="hover:text-white transition-colors">Government Jobs</Link></li>
              <li><Link to="/find-jobs?category=NGO" className="hover:text-white transition-colors">NGO Opportunities</Link></li>
              <li><Link to="/find-jobs?category=Private" className="hover:text-white transition-colors">Private Sector</Link></li>
              <li><Link to="/find-jobs?type=Internship" className="hover:text-white transition-colors">Internships</Link></li>
              <li><Link to="/find-jobs?category=Graduate" className="hover:text-white transition-colors">Graduate Programs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#2563EB] shrink-0" />
                <span>Kigali, Rwanda<br />Kigali Heights, 4th Floor</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#2563EB] shrink-0" />
                <span>+250 788 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#2563EB] shrink-0" />
                <span>info@rwandajobs.rw</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} Rwanda Jobs & Opportunities. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
