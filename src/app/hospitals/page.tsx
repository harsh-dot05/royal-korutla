'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HOSPITALS, DOCTORS, EMERGENCY_CONTACTS } from '@/data/mockData';
import { Doctor } from '@/types';
import { HeartPulse, Phone, MessageSquare, Clock, MapPin, CheckCircle2, User, X } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
                <HeartPulse className="w-3.5 h-3.5 text-blue-700" />
                <span>Korutla Healthcare Services</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Hospitals &amp; Doctors in <span className="text-blue-700">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
                24/7 hospitals, diagnostic labs, pharmacies, and specialist doctors in Korutla town.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-center w-full md:w-auto">
              <span className="text-xs font-bold text-slate-700 block mb-1">Emergency Helpline</span>
              <a href="tel:08725252300" className="text-xl font-extrabold text-blue-700 hover:underline">
                08725-252300
              </a>
            </div>
          </div>
        </div>

        {/* 24/7 Emergency Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {EMERGENCY_CONTACTS.map((em) => (
            <div key={em.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase">{em.category}</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{em.name}</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{em.phone}</p>
              </div>
              <a href={`tel:${em.phone}`} className="p-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Hospitals Directory */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-blue-700" />
            <span>Hospitals in Korutla</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {HOSPITALS.map((hosp) => (
              <div key={hosp.id} className="rounded-xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image src={hosp.image} alt={hosp.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold">24x7 OPEN</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{hosp.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-700" /> {hosp.address}
                      </p>
                    </div>
                  </div>

                  <a href={`tel:${hosp.emergencyPhone}`} className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors">
                    Call Hospital
                  </a>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Departments &amp; Facilities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.departments.map((dept, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-blue-50 text-xs font-semibold text-blue-900 border border-blue-100">
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
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-700" />
            <span>Specialist Doctors</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOCTORS.map((doc) => (
              <div key={doc.id} className="rounded-xl p-5 border border-slate-200 bg-white shadow-xs flex gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image src={doc.image} alt={doc.name} fill sizes="112px" className="object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{doc.specialization}</span>
                    <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-600">{doc.qualification} ({doc.experienceYears} Yrs Exp)</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {doc.timings}
                    </p>
                    <p className="text-xs font-bold text-slate-800 mt-1">Consultation Fee: {doc.consultationFee}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="flex-1 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
                    >
                      Book Appointment
                    </button>
                    {doc.whatsapp && (
                      <a
                        href={`https://wa.me/${doc.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Dr. ${doc.name}, I want to book an OPD consultation slot.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-100 text-blue-700 border border-slate-200 hover:bg-slate-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            {appointmentConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-blue-700 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Appointment Request Sent</h3>
                <p className="text-xs text-slate-600">
                  {selectedDoctor.hospitalName} clinic reception will contact you directly to confirm.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Book Appointment with {selectedDoctor.name}</h3>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">{selectedDoctor.specialization} ({selectedDoctor.consultationFee})</p>
                </div>

                <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Patient Name *"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Patient Phone Number *"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700"
                  />
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-700"
                  />
                  <button type="submit" className="w-full py-3 rounded-lg bg-blue-700 hover:bg-blue-800 font-bold text-white text-xs transition-colors">
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
