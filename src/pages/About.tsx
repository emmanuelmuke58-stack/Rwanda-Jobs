import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">About Rwanda Jobs</h1>
        <p className="text-xl text-gray-500">Connecting talent with opportunity in the Land of a Thousand Hills.</p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
        <p>
          Rwanda Jobs & Opportunities is a modern platform dedicated to publishing and organizing the latest job vacancies, tenders, and public announcements across Rwanda.
        </p>
        <h2 className="text-2xl font-bold text-[#0F172A] pt-6">Our Mission</h2>
        <p>
          Our mission is to serve as a central information directory where Rwandans can discover career-defining opportunities from government institutions, NGOs, and the private sector.
        </p>
        <h2 className="text-2xl font-bold text-[#0F172A] pt-6">What We Do</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Publish latest job vacancies from diverse sectors.</li>
          <li>Feature public and private tender announcements.</li>
          <li>Share scholarship and internship opportunities.</li>
          <li>Provide a directory of employers in Rwanda.</li>
        </ul>
        <p className="bg-blue-50 p-6 rounded-2xl text-blue-800 font-medium italic border border-blue-100">
          Important: Rwanda Jobs is an information publishing platform, not a recruitment agency. We do not charge fees for job applications or handle the recruitment process directly.
        </p>
      </div>
    </div>
  );
}
