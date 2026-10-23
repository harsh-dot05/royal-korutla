'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HOSPITALS, DOCTORS, EMERGENCY_CONTACTS } from '@/data/mockData';
import { Doctor } from '@/types';
import { HeartPulse, Phone, MessageCircle, Clock, MapPin, CheckCircle2, User, X, Stethoscope, AlertTriangle } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] text-xs font-bold mb-3">
                <HeartPulse className="w-3.5 h-3.5 text-[#BE123C]" />
                <span>Korutla Healthcare Services</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Hospitals &amp; Doctors in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] mt-2 max-w-xl leading-relaxed">
                24/7 emergency care hospitals, diagnostic labs, pharmacies, and specialist doctors serving Korutla town and nearby mandals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-center w-full md:w-auto space-y-1">
              <span className="text-xs font-bold text-[#BE123C] block">24/7 Emergency Helpline</span>
              <a href="tel:08725252300" className="text-2xl font-extrabold text-[#BE123C] hover:underline block">
                08725-252300
              </a>
              <span className="text-[10px] text-[#647067]">Direct Line • Ambulance &amp; Casualty</span>
            </div>
          </div>
        </div>

        {/* 24/7 Emergency Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {EMERGENCY_CONTACTS.map((em) => (
            <div key={em.id} className="p-4 rounded-2xl border border-[#E8E5DF] bg-white shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#BE123C] uppercase tracking-wide">{em.category}</span>
                <h4 className="text-xs font-bold text-[#26352D] mt-0.5">{em.name}</h4>
                <p className="text-[11px] text-[#647067] font-mono mt-0.5">{em.phone}</p>
              </div>
              <a
                href={`tel:${em.phone}`}
                className="p-2.5 rounded-xl bg-[#BE123C] hover:bg-[#9F1239] text-white transition-colors"
                aria-label={`Call ${em.name}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Hospitals Directory */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-[#26352D] flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#E66A32]" />
            <span>Hospitals in Korutla</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {HOSPITALS.map((hosp) => (
              <div key={hosp.id} className="rounded-2xl p-6 border border-[#E8E5DF] bg-white shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E5DF]">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E5DF]">
                      <Image src={hosp.image} alt={hosp.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#26352D] text-white text-[10px] font-bold">24x7 OPEN</span>
                      </div>
                      <h3 className="text-base font-bold text-[#26352D] mt-1">{hosp.name}</h3>
                      <p className="text-xs text-[#647067] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" /> {hosp.address}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${hosp.emergencyPhone}`}
                    className="px-4 py-2.5 rounded-xl bg-[#26352D] hover:bg-[#1E2B24] text-white text-xs font-bold transition-colors shrink-0"
                  >
                    Call Hospital
                  </a>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#647067] uppercase tracking-wider mb-2">Departments &amp; Facilities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.departments.map((dept, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-[#FFF6F0] text-xs font-semibold text-[#E66A32] border border-[#F8CFBE]">
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
          <h2 className="text-xl font-extrabold text-[#26352D] flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#E66A32]" />
            <span>Specialist Doctors</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOCTORS.map((doc) => (
              <div key={doc.id} className="rounded-2xl p-5 border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs flex flex-col sm:flex-row gap-4 transition-all">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E5DF]">
                  <Image src={doc.image} alt={doc.name} fill sizes="112px" className="object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider">{doc.specialization}</span>
                    <h3 className="text-base font-bold text-[#26352D]">{doc.name}</h3>
                    <p className="text-xs text-[#647067]">{doc.qualification} ({doc.experienceYears} Yrs Exp)</p>
                    <p className="text-[11px] text-[#647067] flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-[#647067]" /> {doc.timings}
                    </p>
                    <p className="text-xs font-bold text-[#26352D] mt-1">Consultation Fee: {doc.consultationFee}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="flex-1 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
                    >
                      Book Appointment
                    </button>
                    {doc.whatsapp && (
                      <a
                        href={`https://wa.me/${doc.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Dr. ${doc.name}, I want to book an OPD consultation slot.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors"
                        aria-label={`WhatsApp Dr. ${doc.name}`}
                      >
                        <MessageCircle className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352D]/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E8E5DF] rounded-2xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 text-[#647067] hover:text-[#26352D]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {appointmentConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#E66A32] mx-auto" />
                <h3 className="text-lg font-bold text-[#26352D]">Appointment Request Sent</h3>
                <p className="text-xs text-[#647067]">
                  {selectedDoctor.hospitalName} clinic reception in Korutla will contact you directly to confirm your slot.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-bold text-[#26352D]">Book Appointment with {selectedDoctor.name}</h3>
                  <p className="text-xs text-[#E66A32] font-semibold mt-0.5">{selectedDoctor.specialization} ({selectedDoctor.consultationFee})</p>
                </div>

                <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Patient Name *"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Patient Phone Number *"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] font-bold text-white text-xs transition-colors shadow-xs"
                  >
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
