'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Clock, Navigation, Search, TreePine } from 'lucide-react';

interface PublicPlace {
  id: string;
  name: string;
  category: 'Temple' | 'Park' | 'Bus Station' | 'Landmark' | 'Municipal';
  location: string;
  openingHours: string;
  description: string;
  image: string;
  googleMapQuery: string;
}

const PUBLIC_PLACES: PublicPlace[] = [
  {
    id: 'pp-1',
    name: 'Sri Venkateshwara Swamy Temple, Korutla',
    category: 'Temple',
    location: 'Temple Street, Korutla',
    openingHours: '06:00 AM - 12:30 PM & 05:00 PM - 08:30 PM',
    description: 'Revered Sri Venkateshwara temple located in the heart of Korutla town.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'Venkateshwara Temple Korutla',
  },
  {
    id: 'pp-2',
    name: 'Korutla Municipal Children & Botanical Park',
    category: 'Park',
    location: 'Bypass Road, Korutla',
    openingHours: '05:30 AM - 09:00 AM & 04:30 PM - 08:00 PM',
    description: 'Public park equipped with walking track, open gym equipment, and children play area.',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'Korutla Public Park',
  },
  {
    id: 'pp-3',
    name: 'TSRTC Bus Station Depot Korutla',
    category: 'Bus Station',
    location: 'Bus Station Road, Korutla',
    openingHours: 'Open 24 Hours',
    description: 'Central bus terminal connecting Korutla to Metpally, Jagtial, Karimnagar, and Hyderabad routes.',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'TSRTC Bus Stand Korutla',
  },
  {
    id: 'pp-4',
    name: 'Historical Gandhi Statue Center & Clock Tower',
    category: 'Landmark',
    location: 'Main Center, Korutla',
    openingHours: 'Open 24 Hours',
    description: 'Central junction landmark of Korutla town surrounding the historic Mahatma Gandhi statue.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'Gandhi Statue Korutla',
  },
  {
    id: 'pp-5',
    name: 'Korutla Municipal Complex & Office',
    category: 'Municipal',
    location: 'Main Road, Korutla',
    openingHours: '10:30 AM - 05:00 PM (Mon-Sat)',
    description: 'Government civic center providing municipal citizen services and local administrative offices.',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'Korutla Municipality Office',
  },
];

export default function PublicPlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Temple', 'Park', 'Bus Station', 'Landmark', 'Municipal'];

  const filteredPlaces = PUBLIC_PLACES.filter((place) => {
    const matchesCat = selectedCat === 'All' || place.category === selectedCat;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || place.description.toLowerCase().includes(searchQuery.toLowerCase());
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
                <TreePine className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Public Places &amp; Parks</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Public Places &amp; Landmarks in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl leading-relaxed">
                Temples, municipal parks, TSRTC bus station, and historic civic landmarks in Korutla town.
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
              placeholder="Search temple, park, bus station..."
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

        {/* Places Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <p className="text-sm font-semibold text-[#26352D]">No public landmarks match your search.</p>
            <button
              onClick={() => { setSelectedCat('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="rounded-2xl border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs overflow-hidden flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="relative h-48 w-full bg-[#FAF7F2] border-b border-[#E8E5DF]">
                    <Image src={place.image} alt={place.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#26352D] text-white text-[10px] font-bold shadow-xs">
                      {place.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-[#26352D] leading-snug">{place.name}</h3>
                    <p className="text-xs text-[#647067] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                      <span>{place.location}</span>
                    </p>
                    <p className="text-xs text-[#647067] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#647067] shrink-0" />
                      <span>{place.openingHours}</span>
                    </p>
                    <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed pt-1">
                      {place.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(place.googleMapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#E8E5DF]"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Get Directions</span>
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
