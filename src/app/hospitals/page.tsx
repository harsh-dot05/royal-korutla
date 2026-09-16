'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HOSPITALS, DOCTORS, EMERGENCY_CONTACTS } from '@/data/mockData';
import { Doctor } from '@/types';
import { HeartPulse, Phone, MessageSquare, Clock, MapPin, ShieldAlert, Calendar, CheckCircle2, User, X } from 'lucide-react';

export default function HospitalsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentConfirmed(true);
    setTimeout(() => {
      setAppointmentConfirmed(false);
      setSelectedDoctor(null);
      setPatientName('');
      setPatientPhone('');
      setAppointmentDate('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-3xl pastel-card p-6 sm:p-8 border border-rose-200/80 bg-gradient-to-r from-rose-50 via-pink-50 to-white shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold mb-3">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                <span>Korutla Healthcare &amp; Emergency Hub</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Hospitals &amp; Specialist Doctors in <span className="text-rose-600">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                Find 24/7 hospitals, diagnostic labs, pharmacies, and specialist doctors in Korutla town. Book doctor OPD consultations online.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 text-center w-full md:w-auto shadow-sm">
              <span className="text-xs font-bold text-rose-700 block mb-1">Emergency Helpline</span>
              <a href="tel:08725252300" className="text-xl font-black text-rose-600 hover:text-rose-700">
                08725-252300
              </a>
            </div>
          </div>
        </div>

        {/* 24/7 Emergency Quick Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {EMERGENCY_CONTACTS.map((em) => (
            <div key={em.id} className="p-4 rounded-2xl pastel-card border border-rose-100 bg-white shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-700 uppercase">{em.category}</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{em.name}</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{em.phone}</p>
              </div>
              <a href={`tel:${em.phone}`} className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Hospitals Directory */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <span>Featured Hospitals in Korutla</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {HOSPITALS.map((hosp) => (
              <div key={hosp.id} className="pastel-card rounded-2xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image src={hosp.image} alt={hosp.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">24x7 OPEN</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{hosp.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-600" /> {hosp.address}
                      </p>
                    </div>
                  </div>

                  <a href={`tel:${hosp.emergencyPhone}`} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm">
                    Call Hospital
                  </a>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Departments &amp; Facilities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.departments.map((dept, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-50 text-xs font-medium text-rose-900 border border-rose-100">
                        • {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Doctors Directory */}
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <span>Specialist Doctors in Korutla</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOCTORS.map((doc) => (
              <div key={doc.id} className="pastel-card pastel-card-hover rounded-2xl p-5 border border-slate-100 bg-white shadow-sm flex gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image src={doc.image} alt={doc.name} fill sizes="112px" className="object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider">{doc.specialization}</span>
                    <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-600">{doc.qualification} ({doc.experienceYears} Yrs Exp)</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-emerald-600" /> {doc.timings}
                    </p>
                    <p className="text-xs font-bold text-emerald-700 mt-1">Consultation Fee: {doc.consultationFee}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      Book Appointment
                    </button>
                    {doc.whatsapp && (
                      <a
                        href={`https://wa.me/${doc.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Dr. ${doc.name}, I want to book an OPD consultation slot.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Appointment Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            {appointmentConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-900">Appointment Request Sent!</h3>
                <p className="text-xs text-slate-600">
                  {selectedDoctor.hospitalName} clinic reception will call you back to confirm your appointment time.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Book Appointment with {selectedDoctor.name}</h3>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">{selectedDoctor.specialization} ({selectedDoctor.consultationFee})</p>
                </div>

                <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Patient Name *"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Patient Phone Number *"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-xs transition-colors shadow-sm">
                    Confirm Appointment Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
