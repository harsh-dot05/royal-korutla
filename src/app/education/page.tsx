'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GraduationCap, MapPin, Phone, MessageCircle, Clock, BookOpen, Search } from 'lucide-react';

interface EducationInstitute {
  id: string;
  name: string;
  category: string;
  courses: string[];
  location: string;
  timings: string;
  phone: string;
  whatsapp: string;
  image: string;
  description: string;
  badge?: string;
}

const INSTITUTES: EducationInstitute[] = [
  {
    id: 'edu-1',
    name: 'Govt Degree & PG College, Korutla',
    category: 'Degree & PG College',
    courses: ['B.Sc (Comp Science)', 'B.Com (Computer App)', 'B.A.', 'M.Sc'],
    location: 'Metpally Highway Road, Korutla',
    timings: '10:00 AM - 04:30 PM',
    phone: '+91 87252 52200',
    whatsapp: '+91 98480 12345',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
    description: 'Government higher education institution in Korutla offering accredited degree courses.',
    badge: 'Govt Accredited',
  },
  {
    id: 'edu-2',
    name: 'Sri Chaitanya Junior College & IIT Academy',
    category: 'Junior College & Coaching',
    courses: ['MPC (IIT-JEE)', 'BiPC (NEET)', 'MEC', 'Foundation Coaching'],
    location: 'High School Road, Korutla',
    timings: '08:00 AM - 06:00 PM',
    phone: '+91 98490 88776',
    whatsapp: '+91 98490 88776',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80',
    description: 'Specialized 10+2 intermediate college offering competitive entrance coaching.',
    badge: 'Top Ranks',
  },
  {
    id: 'edu-3',
    name: 'APEX Computer & Spoken English Institute',
    category: 'Computer & Vocational Training',
    courses: ['MS Office & Tally Prime', 'Python & Web Design', 'Spoken English', 'DTP & Graphic Design'],
    location: 'Main Road, Opp Old Bus Stand, Korutla',
    timings: '07:00 AM - 08:00 PM',
    phone: '+91 99890 33445',
    whatsapp: '+91 99890 33445',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    description: 'ISO Certified computer training center providing recognized diplomas and skills.',
  },
  {
    id: 'edu-4',
    name: 'Royal Kids High School (English Medium)',
    category: 'School (Nursery to 10th)',
    courses: ['State Board Syllabus', 'IIT Foundation', 'Abacus & Vedic Math', 'Sports'],
    location: 'Venkateshwara Nagar, Korutla',
    timings: '08:30 AM - 04:00 PM',
    phone: '+91 94401 55667',
    whatsapp: '+91 94401 55667',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    description: 'English medium school fostering academic growth and smart classrooms.',
  },
];

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Junior College & Coaching', 'Degree & PG College', 'Computer & Vocational Training', 'School (Nursery to 10th)'];

  const filteredInstitutes = INSTITUTES.filter((inst) => {
    const matchesCat = selectedCat === 'All' || inst.category === selectedCat;
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || inst.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold mb-3">
                <GraduationCap className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Education Directory</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Schools, Colleges &amp; Institutes in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl leading-relaxed">
                Junior colleges, degree institutes, coaching academies, tuition hubs, and computer training centers in Korutla town.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#647067]" />
            <input
              type="text"
              placeholder="Search computer, college, school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#26352D] placeholder-[#647067] focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-[#E66A32] text-white shadow-xs'
                    : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Institutions Grid */}
        {filteredInstitutes.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <p className="text-sm font-semibold text-[#26352D]">No educational institutions match your search.</p>
            <button
              onClick={() => { setSelectedCat('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInstitutes.map((inst) => (
              <div
                key={inst.id}
                className="rounded-2xl border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs p-6 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E5DF]">
                    <Image src={inst.image} alt={inst.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    {inst.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#26352D] text-white text-[10px] font-bold shadow-xs">
                        {inst.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#E66A32] uppercase tracking-wider">{inst.category}</span>
                    <h3 className="text-base font-bold text-[#26352D] mt-0.5">{inst.name}</h3>
                    <p className="text-xs text-[#647067] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                      <span>{inst.location}</span>
                    </p>
                    <p className="text-xs text-[#647067] mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#647067] shrink-0" />
                      <span>{inst.timings}</span>
                    </p>
                  </div>

                  <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed">
                    {inst.description}
                  </p>

                  {/* Courses List */}
                  <div>
                    <p className="text-[11px] font-bold text-[#26352D] mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#E66A32]" /> Offered Courses:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {inst.courses.map((course, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-[#FFF6F0] text-[10px] font-semibold text-[#E66A32] border border-[#F8CFBE]">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#E8E5DF] grid grid-cols-2 gap-3 text-xs font-bold">
                  <a
                    href={`tel:${inst.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] transition-colors border border-[#E8E5DF]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Call Institute</span>
                  </a>
                  <a
                    href={`https://wa.me/${inst.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inst.name}, I found your institution on Royal Korutla. I would like to inquire about admissions and courses.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
