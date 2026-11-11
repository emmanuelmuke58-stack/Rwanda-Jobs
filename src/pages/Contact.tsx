import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A]">Get in Touch</h1>
            <p className="text-xl text-gray-500">Have questions about an opportunity or want to publish one? We're here to help.</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">Our Office</h3>
                <p className="text-gray-500 leading-relaxed">Kigali Heights, 4th Floor<br />Kigali, Rwanda</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">Email Us</h3>
                <p className="text-gray-500 leading-relaxed">info@rwandajobs.rw<br />support@rwandajobs.rw</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">Call Us</h3>
                <p className="text-gray-500 leading-relaxed">+250 788 000 000<br />+250 722 000 000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 space-y-8">
          <h2 className="text-2xl font-bold text-[#0F172A]">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Subject</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Message</label>
              <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tell us more..."></textarea>
            </div>
            <button className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-2xl hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]">
              <Send size={20} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
