'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PublicRepresentative } from '@/types';
import {
  ShieldCheck,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Search,
  ArrowLeft,
  Save,
  X,
  User,
  Building2,
  Landmark,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function AdminRepresentativesPage() {
  const [representatives, setRepresentatives] = useState<PublicRepresentative[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'KEY' | 'WARDS' | 'VERIFIED' | 'PENDING'>('ALL');
  const [selectedRep, setSelectedRep] = useState<PublicRepresentative | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields for editing
  const [formName, setFormName] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formAreaName, setFormAreaName] = useState('');
  const [formConstituency, setFormConstituency] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formOfficeAddress, setFormOfficeAddress] = useState('');
  const [formTermPeriod, setFormTermPeriod] = useState('');
  const [formIsVerified, setFormIsVerified] = useState(false);

  const fetchRepresentatives = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/representatives');
      if (res.status === 401 || res.status === 403) {
        // Fallback fetch public if not currently authenticated
        const pubRes = await fetch('/api/representatives');
        const pubJson = await pubRes.json();
        if (pubJson.success && pubJson.data) {
          setRepresentatives(pubJson.data.all || []);
        }
      } else {
        const json = await res.json();
        if (json.success && json.data) {
          setRepresentatives(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching admin representatives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepresentatives();
  }, []);

  const openEditModal = (rep: PublicRepresentative) => {
    setSelectedRep(rep);
    setFormName(rep.name || '');
    setFormDesignation(rep.designation || '');
    setFormAreaName(rep.areaName || '');
    setFormConstituency(rep.constituency || '');
    setFormPhotoUrl(rep.photoUrl || '');
    setFormPhone(rep.phone || '');
    setFormEmail(rep.email || '');
    setFormOfficeAddress(rep.officeAddress || '');
    setFormTermPeriod(rep.termPeriod || '');
    setFormIsVerified(rep.isVerified || false);
    setIsEditModalOpen(true);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRep) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/representatives', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRep.id,
          name: formName,
          designation: formDesignation,
          areaName: formAreaName,
          constituency: formConstituency,
          photoUrl: formPhotoUrl,
          phone: formPhone,
          email: formEmail,
          officeAddress: formOfficeAddress,
          termPeriod: formTermPeriod,
          isVerified: formIsVerified,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({ type: 'success', text: `Saved changes for ${selectedRep.designation}` });
        setIsEditModalOpen(false);
        fetchRepresentatives();
      } else {
        setMessage({ type: 'error', text: json.message || 'Failed to update record' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error while saving' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetRecord = async (rep: PublicRepresentative) => {
    if (!window.confirm(`Reset and clear details for ${rep.designation}?`)) return;

    try {
      const res = await fetch(`/api/admin/representatives?id=${rep.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: 'success', text: `Reset slot ${rep.designation}` });
        fetchRepresentatives();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickToggleVerify = async (rep: PublicRepresentative) => {
    try {
      const res = await fetch('/api/admin/representatives', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rep.id,
          isVerified: !rep.isVerified,
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchRepresentatives();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered list
  const filteredList = representatives.filter((r) => {
    if (filterRole === 'KEY' && r.role === 'WARD_COUNCILLOR') return false;
    if (filterRole === 'WARDS' && r.role !== 'WARD_COUNCILLOR') return false;
    if (filterRole === 'VERIFIED' && !r.isVerified) return false;
    if (filterRole === 'PENDING' && r.isVerified) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const wardMatch = r.wardNumber ? `ward ${r.wardNumber}`.includes(q) || String(r.wardNumber) === q : false;
    const nameMatch = r.name?.toLowerCase().includes(q) || false;
    const desigMatch = r.designation?.toLowerCase().includes(q) || false;
    const areaMatch = r.areaName?.toLowerCase().includes(q) || false;

    return wardMatch || nameMatch || desigMatch || areaMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647067] hover:text-[#E66A32] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26352D] tracking-tight">
              Manage Public Representatives
            </h1>
            <p className="text-xs sm:text-sm text-[#647067]">
              Administrative control for MLA, Municipal Chairperson, and all 33 Ward Councillors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/representatives"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#E8E5DF] text-xs font-semibold text-[#26352D] hover:bg-[#FAF7F2] shadow-xs"
            >
              <span>View Live Directory</span>
            </Link>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Toolbar & Filters */}
        <div className="bg-white border border-[#E8E5DF] rounded-xl p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#647067] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ward number, name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg pl-9 pr-3 py-2 text-xs text-[#26352D] placeholder-[#647067] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: 'ALL', label: `All (${representatives.length})` },
                { id: 'KEY', label: 'MLA & Chairman (2)' },
                { id: 'WARDS', label: 'Wards 1-33 (33)' },
                { id: 'VERIFIED', label: `Verified (${representatives.filter((r) => r.isVerified).length})` },
                { id: 'PENDING', label: `Pending (${representatives.filter((r) => !r.isVerified).length})` },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterRole(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterRole === t.id
                    ? 'bg-[#26352D] text-white'
                    : 'bg-[#FAF7F2] text-[#647067] hover:bg-[#F4EFE7]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Records Table / List */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-[#E8E5DF] text-[#647067] uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Slot / Role</th>
                  <th className="py-3 px-4">Representative Name</th>
                  <th className="py-3 px-4">Constituency / Area</th>
                  <th className="py-3 px-4">Public Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DF]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#647067]">
                      Loading records...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#647067]">
                      No matching representative slots found.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((rep) => {
                    return (
                      <tr key={rep.id} className="hover:bg-[#FFFDFB] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#26352D]">
                          <div className="flex items-center gap-2">
                            {rep.role === 'MLA' ? (
                              <span className="px-2 py-0.5 rounded bg-[#FFF6F0] text-[#E66A32] font-black border border-[#F8CFBE]">
                                MLA
                              </span>
                            ) : rep.role === 'MUNICIPAL_CHAIRMAN' ? (
                              <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#26352D] font-black border border-[#E8E5DF]">
                                CHAIRMAN
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#647067] font-bold border border-[#E8E5DF]">
                                WARD {String(rep.wardNumber).padStart(2, '0')}
                              </span>
                            )}
                            <span className="text-xs text-[#647067]">{rep.designation}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[#26352D]">
                          {rep.name ? (
                            <div className="flex items-center gap-2">
                              {rep.photoUrl && (
                                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#E8E5DF] shrink-0">
                                  <Image src={rep.photoUrl} alt="" fill className="object-cover" sizes="28px" />
                                </div>
                              )}
                              <span>{rep.name}</span>
                            </div>
                          ) : (
                            <span className="text-[#647067] italic font-normal">Awaiting Details</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-[#647067]">
                          {rep.areaName || rep.constituency || '—'}
                        </td>

                        <td className="py-3.5 px-4 text-[#647067]">
                          {rep.phone || '—'}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickToggleVerify(rep)}
                            title="Click to toggle verification status"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                              rep.isVerified
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-[#FAF7F2] text-[#647067] border border-[#E8E5DF] hover:bg-[#F4EFE7]'
                            }`}
                          >
                            {rep.isVerified ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 text-[#647067]" />
                                <span>Pending</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(rep)}
                              className="px-2.5 py-1 rounded-md bg-[#26352D] hover:bg-[#1E2B24] text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            {rep.name && (
                              <button
                                type="button"
                                onClick={() => handleResetRecord(rep)}
                                title="Clear data back to unverified empty state"
                                className="p-1 rounded-md text-[#647067] hover:text-rose-600 hover:bg-rose-50"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedRep && (
          <div className="fixed inset-0 z-50 bg-[#26352D]/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#E8E5DF] w-full max-w-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF]">
                <div>
                  <h3 className="font-extrabold text-lg text-[#26352D]">
                    Edit Representative Record
                  </h3>
                  <p className="text-xs text-[#647067]">{selectedRep.designation}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#647067] hover:bg-[#FAF7F2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-[#26352D] mb-1">
                    Official Representative Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Smt./Sri Full Name"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg p-2.5 text-[#26352D] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#647067] mt-0.5 block">
                    Leave blank if not yet authenticated or awaiting election results.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#26352D] mb-1">
                      Official Designation
                    </label>
                    <input
                      type="text"
                      value={formDesignation}
                      onChange={(e) => setFormDesignation(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg p-2.5 text-[#26352D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#26352D] mb-1">
                      Ward / Area Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={formAreaName}
                      onChange={(e) => setFormAreaName(e.target.value)}
                      placeholder="e.g. Ward 1 - Old Bus Stand / Gandhi Nagar"
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg p-2.5 text-[#26352D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#26352D] mb-1">
                      Public Phone Number
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 9XXXXXXXXX"
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg p-2.5 text-[#26352D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#26352D] mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="mla.korutla@telangana.gov.in"
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg p-2.5 text-[#26352D] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#26352D] mb-1">
                    Official Photograph URL
                  </label>
                  <input
                    type="url"
                    value={formPhotoUrl}
                    onChange={(e) => setFormPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg p-2.5 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#26352D] mb-1">
                    Public Office / Grievance Address
                  </label>
                  <textarea
                    rows={2}
                    value={formOfficeAddress}
                    onChange={(e) => setFormOfficeAddress(e.target.value)}
                    placeholder="e.g. Camp Office, Main Road, Korutla, Jagtial Dist, Telangana"
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-lg p-2.5 text-[#26352D] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF]">
                    <input
                      type="checkbox"
                      checked={formIsVerified}
                      onChange={(e) => setFormIsVerified(e.target.checked)}
                      className="w-4 h-4 accent-[#E66A32] rounded"
                    />
                    <div>
                      <span className="font-bold text-[#26352D] block">
                        Mark as Officially Verified Public Record
                      </span>
                      <span className="text-[10px] text-[#647067] block">
                        When verified, details appear live on the public directory with a verification badge.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-3 border-t border-[#E8E5DF] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE7] text-[#26352D] font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Representative Record'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
