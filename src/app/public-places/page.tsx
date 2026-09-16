'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Clock, Navigation, Search, TreePine, Landmark, Bus, Building } from 'lucide-react';

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
    description: 'Historic and revered Sri Venkateshwara temple located in the heart of Korutla town, visited daily by hundreds of devotees.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'Venkateshwara Temple Korutla',
  },
  {
    id: 'pp-2',
    name: 'Korutla Municipal Children & Botanical Park',
    category: 'Park',
    location: 'Bypass Road, Korutla',
    openingHours: '05:30 AM - 09:00 AM & 04:30 PM - 08:00 PM',
    description: 'Lush green public park equipped with walking track, open gym equipment, children play area, and seating benches for morning walks.',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'Korutla Public Park',
  },
  {
    id: 'pp-3',
    name: 'TSRTC Bus Station Depot Korutla',
    category: 'Bus Station',
    location: 'Bus Station Road, Korutla',
    openingHours: 'Open 24 Hours',
    description: 'Central bus terminal connecting Korutla to Metpally, Jagtial, Karimnagar, Hyderabad, Nizamabad, and Mumbai routes.',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'TSRTC Bus Stand Korutla',
  },
  {
    id: 'pp-4',
    name: 'Historical Gandhi Statue Center & Clock Tower',
    category: 'Landmark',
    location: 'Main Center, Korutla',
    openingHours: 'Open 24 Hours',
    description: 'Iconic central junction and landmark of Korutla town surrounding the historic Mahatma Gandhi statue.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
    googleMapQuery: 'Gandhi Statue Korutla',
  },
  {
    id: 'pp-5',
    name: 'Korutla Municipal Complex & Office',
    category: 'Municipal',
    location: 'Main Road, Korutla',
    openingHours: '10:30 AM - 05:00 PM (Mon-Sat)',
    description: 'Government civic center providing municipal citizen services, property tax counters, and local administrative offices.',
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-3xl pastel-card p-6 sm:p-8 border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-white shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
                <TreePine className="w-3.5 h-3.5 text-emerald-700" />
                <span>Korutla Town Map &amp; Landmarks</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Public Places &amp; Parks in <span className="text-emerald-700">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Explore famous temples, public parks, bus stations, landmarks, and civic offices across Korutla town.
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
              placeholder="Search 'Temple', 'Park', 'Bus Station'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Public Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="pastel-card pastel-card-hover rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image src={place.image} alt={place.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-bold shadow-sm">
                    {place.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{place.name}</h3>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{place.location}</span>
                  </p>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-emerald-700 font-semibold">{place.openingHours}</span>
                  </p>

                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {place.description}
                  </p>
                </div>
              </div>

              {/* Action Button: Get Directions */}
              <div className="p-5 pt-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.googleMapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
