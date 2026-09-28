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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
                <TreePine className="w-3.5 h-3.5 text-blue-700" />
                <span>Korutla Public Places &amp; Parks</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Public Places &amp; Landmarks in <span className="text-blue-700">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Temples, public parks, bus stations, landmarks, and municipal offices across Korutla town.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search temple, park, bus station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Public Places Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">No public places match your search.</p>
            <button
              onClick={() => { setSelectedCat('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                    <Image src={place.image} alt={place.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-700 text-white text-[10px] font-bold shadow-xs">
                      {place.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{place.name}</h3>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{place.location}</span>
                    </p>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-700 font-semibold">{place.openingHours}</span>
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      {place.description}
                    </p>
                  </div>
                </div>

                {/* Action Button: Get Directions */}
                <div className="p-4 pt-0">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.googleMapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-700" />
                    <span>Get Directions on Google Maps</span>
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
