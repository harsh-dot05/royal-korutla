'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EmergencyContact } from '@/types';
import {
  AlertTriangle,
  ArrowLeft,
  Plus,
  RefreshCw,
  Phone,
  ShieldCheck,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Search,
} from 'lucide-react';

const CATEGORIES: EmergencyContact['category'][] = [
  'Ambulance',
  'Hospital',
  'Police',
  'Fire',
  'Municipal',
];

export default function AdminEmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<EmergencyContact['category']>('Ambulance');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formAvailable24x7, setFormAvailable24x7] = useState(true);
  const [formIsVerified, setFormIsVerified] = useState(true);
  const [formTiming, setFormTiming] = useState('24 Hours Daily');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/emergency');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setContacts(data.data);
      } else {
        showNotification('error', data.message || 'Failed to load emergency contacts');
      }
    } catch {
      showNotification('error', 'Network error loading emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const openAddModal = () => {
    setEditingContact(null);
    setFormName('');
    setFormCategory('Ambulance');
    setFormPhone('');
    setFormAddress('Korutla Town');
    setFormAvailable24x7(true);
    setFormIsVerified(true);
    setFormTiming('24 Hours Daily');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormCategory(contact.category);
    setFormPhone(contact.phone);
    setFormAddress(contact.address);
    setFormAvailable24x7(contact.available24x7);
    setFormIsVerified(Boolean(contact.isVerified));
    setFormTiming(contact.timing || (contact.available24x7 ? '24 Hours Daily' : 'Standard Daytime'));
    setFormNotes(contact.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showNotification('error', 'Please enter provider name and telephone number.');
      return;
    }

    setSaving(true);
    try {
      if (editingContact) {
        // Update existing record
        const res = await fetch('/api/admin/emergency', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingContact.id,
            name: formName.trim(),
            category: formCategory,
            phone: formPhone.trim(),
            address: formAddress.trim(),
            available24x7: formAvailable24x7,
            isVerified: formIsVerified,
            timing: formTiming.trim(),
            notes: formNotes.trim(),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setContacts((prev) =>
            prev.map((c) => (c.id === editingContact.id ? data.data : c))
          );
          showNotification('success', 'Emergency contact record updated.');
          setIsModalOpen(false);
        } else {
          showNotification('error', data.message || 'Failed to update record');
        }
      } else {
        // Create new record
        const res = await fetch('/api/admin/emergency', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            category: formCategory,
            phone: formPhone.trim(),
            address: formAddress.trim(),
            available24x7: formAvailable24x7,
            isVerified: formIsVerified,
            timing: formTiming.trim(),
            notes: formNotes.trim(),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setContacts((prev) => [data.data, ...prev]);
          showNotification('success', 'New emergency service contact added.');
          setIsModalOpen(false);
        } else {
          showNotification('error', data.message || 'Failed to create record');
        }
      }
    } catch {
      showNotification('error', 'Error saving emergency contact record');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVerify = async (contact: EmergencyContact) => {
    const updatedStatus = !contact.isVerified;
    try {
      const res = await fetch('/api/admin/emergency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contact.id,
          isVerified: updatedStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? { ...c, isVerified: updatedStatus } : c))
        );
        showNotification(
          'success',
          `Verification status updated: ${updatedStatus ? 'Verified' : 'Unverified'}`
        );
      }
    } catch {
      showNotification('error', 'Failed to update verification status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this emergency contact record?')) return;

    try {
      const res = await fetch(`/api/admin/emergency?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        showNotification('success', 'Emergency contact record deleted.');
      } else {
        showNotification('error', data.message || 'Failed to delete record');
      }
    } catch {
      showNotification('error', 'Error deleting record');
    }
  };

  const filteredContacts = contacts.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border text-xs font-bold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-rose-900 text-white border-rose-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E5DF] shadow-xs">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E66A32] hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#26352D] text-white flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-5 h-5 text-[#E66A32]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#26352D]">
                  Emergency &amp; Ambulance Records Management
                </h1>
                <p className="text-xs text-[#647067] mt-0.5">
                  Verify public emergency phone numbers, maintain casualty hospitals, and manage ambulance service dispatch lines.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadContacts}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-[#E8E5DF] bg-white hover:bg-[#FAF7F2] text-xs font-bold text-[#26352D] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E66A32]' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Emergency Contact</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[10px] font-bold text-[#647067] uppercase">Total Contacts</p>
            <p className="text-2xl font-black text-[#26352D] mt-1">{contacts.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[10px] font-bold text-emerald-700 uppercase">24/7 Available</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {contacts.filter((c) => c.available24x7).length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[10px] font-bold text-blue-700 uppercase">Verified Records</p>
            <p className="text-2xl font-black text-blue-700 mt-1">
              {contacts.filter((c) => c.isVerified).length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[10px] font-bold text-[#E66A32] uppercase">Ambulances</p>
            <p className="text-2xl font-black text-[#E66A32] mt-1">
              {contacts.filter((c) => c.category === 'Ambulance').length}
            </p>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] flex items-center justify-between gap-3 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#647067] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by provider, category, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF] text-xs text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32]"
            />
          </div>
          <span className="text-xs text-[#647067] font-semibold">
            Showing {filteredContacts.length} of {contacts.length}
          </span>
        </div>

        {/* Records Table */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E5DF]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#E66A32] mx-auto mb-2" />
            <p className="text-xs text-[#647067] font-semibold">Loading emergency records...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E5DF] space-y-2">
            <AlertTriangle className="w-8 h-8 text-[#647067] mx-auto opacity-50" />
            <p className="text-sm font-bold text-[#26352D]">No emergency records found</p>
            <p className="text-xs text-[#647067]">
              {searchQuery ? 'Try a different search keyword.' : 'Click "Add Emergency Contact" to register a new verified service.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#E8E5DF] bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#647067] border-b border-[#E8E5DF]">
                <tr>
                  <th className="p-3.5">Provider Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Direct Helpline</th>
                  <th className="p-3.5">Availability</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5">Address &amp; Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DF]">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-[#FAF7F2]/50">
                    <td className="p-3.5">
                      <span className="font-extrabold text-[#26352D] block">{contact.name}</span>
                      <span className="text-[10px] text-[#647067] font-mono">#{contact.id}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#26352D] text-white text-[10px] font-bold uppercase">
                        {contact.category}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <a
                        href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                        className="font-bold text-[#E66A32] hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-[#E66A32]" />
                        <span>{contact.phone}</span>
                      </a>
                    </td>

                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        contact.available24x7 ? 'text-emerald-800' : 'text-[#647067]'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{contact.timing || (contact.available24x7 ? '24/7' : 'Daytime')}</span>
                      </span>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleVerify(contact)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          contact.isVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle verification badge"
                      >
                        <ShieldCheck className={`w-3 h-3 ${contact.isVerified ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span>{contact.isVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                      </button>
                    </td>

                    <td className="p-3.5 max-w-xs text-[#647067]">
                      <span className="block truncate font-medium text-[#26352D]">{contact.address}</span>
                      {contact.notes && <span className="text-[10px] italic block truncate">{contact.notes}</span>}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openEditModal(contact)}
                        className="p-1.5 rounded-lg text-[#647067] hover:text-[#26352D] hover:bg-[#FAF7F2] transition-colors"
                        title="Edit record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16201A]/80 p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E8E5DF] shadow-2xl p-6 my-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E66A32]" />
                <h3 className="text-base font-extrabold text-[#26352D]">
                  {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Service'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#647067] hover:text-[#26352D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#26352D] font-bold mb-1">Provider Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 108 Emergency Ambulance Korutla"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EmergencyContact['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Emergency Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 108 or 08725-252300"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#26352D] font-bold mb-1">Address / Station Landmark</label>
                <input
                  type="text"
                  placeholder="e.g., Station Road, Near Bus Stand, Korutla"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div>
                <label className="block text-[#26352D] font-bold mb-1">Service Timing Label</label>
                <input
                  type="text"
                  placeholder="e.g., 24 Hours Daily or 09:30 AM - 05:30 PM"
                  value={formTiming}
                  onChange={(e) => setFormTiming(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div>
                <label className="block text-[#26352D] font-bold mb-1">Emergency Guidance / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Emergency resuscitation, casualty doctor on duty, oxygen on board."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAvailable24x7}
                    onChange={(e) => setFormAvailable24x7(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E66A32]"
                  />
                  <span className="font-bold text-[#26352D]">Available 24x7</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsVerified}
                    onChange={(e) => setFormIsVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E66A32]"
                  />
                  <span className="font-bold text-[#26352D]">Verified Record</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E5DF] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : editingContact ? 'Save Changes' : 'Create Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
