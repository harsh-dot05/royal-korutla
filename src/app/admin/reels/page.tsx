'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ReelRequest, ReelRequestStatus } from '@/types';
import {
  Video,
  ArrowLeft,
  RefreshCw,
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  Save,
  Search,
  Filter,
} from 'lucide-react';

const STATUS_CONFIG: Record<ReelRequestStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'New Request', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-300' },
  CONTACTED: { label: 'Contacted', color: 'text-[#E66A32]', bg: 'bg-[#FFF6F0] border-[#F8CFBE]' },
  SCHEDULED: { label: 'Shoot Scheduled', color: 'text-[#26352D]', bg: 'bg-[#F0F7F3] border-[#C8DFD1]' },
  COMPLETED: { label: 'Reel Delivered', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-300' },
  CANCELLED: { label: 'Cancelled', color: 'text-slate-700', bg: 'bg-slate-200 border-slate-300' },
};

export default function AdminReelsPage() {
  const [requests, setRequests] = useState<ReelRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Editing notes state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reel-requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
      } else {
        showNotification('error', data.message || 'Failed to load reel requests');
      }
    } catch {
      showNotification('error', 'Network error loading requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: ReelRequestStatus) => {
    try {
      const res = await fetch('/api/admin/reel-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r))
        );
        showNotification('success', `Status updated to "${STATUS_CONFIG[newStatus].label}"`);
      } else {
        showNotification('error', data.message || 'Failed to update status');
      }
    } catch {
      showNotification('error', 'Error updating status');
    }
  };

  const startEditNotes = (req: ReelRequest) => {
    setEditingId(req.id);
    setEditNotes(req.adminNotes || '');
    setEditFollowUpDate(req.followUpDate || '');
  };

  const handleSaveNotes = async (id: string) => {
    setSavingNotes(true);
    try {
      const res = await fetch('/api/admin/reel-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          adminNotes: editNotes,
          followUpDate: editFollowUpDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, adminNotes: editNotes, followUpDate: editFollowUpDate, updatedAt: new Date().toISOString() }
              : r
          )
        );
        setEditingId(null);
        showNotification('success', 'Follow-up details saved.');
      } else {
        showNotification('error', data.message || 'Failed to save notes');
      }
    } catch {
      showNotification('error', 'Error saving follow-up notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reel request record?')) return;

    try {
      const res = await fetch(`/api/admin/reel-requests?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        showNotification('success', 'Request record deleted.');
      } else {
        showNotification('error', data.message || 'Failed to delete record');
      }
    } catch {
      showNotification('error', 'Error deleting request');
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contactPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.businessCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.additionalRequirements && r.additionalRequirements.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
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
              <div className="w-10 h-10 rounded-xl bg-[#E66A32] text-white flex items-center justify-center shadow-xs">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#26352D]">
                  Instant Reel Service Requests
                </h1>
                <p className="text-xs text-[#647067] mt-0.5">
                  Manage incoming video requests, schedule shoot appointments, and coordinate follow-ups with Korutla businesses.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadRequests}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-[#E8E5DF] bg-white hover:bg-[#FAF7F2] text-xs font-bold text-[#26352D] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#E66A32]' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[10px] font-bold text-[#647067] uppercase">Total Requests</p>
            <p className="text-xl font-black text-[#26352D] mt-1">{requests.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[10px] font-bold text-amber-700 uppercase">New / Pending</p>
            <p className="text-xl font-black text-amber-700 mt-1">
              {requests.filter((r) => r.status === 'PENDING').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[10px] font-bold text-[#E66A32] uppercase">Contacted</p>
            <p className="text-xl font-black text-[#E66A32] mt-1">
              {requests.filter((r) => r.status === 'CONTACTED').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[10px] font-bold text-[#26352D] uppercase">Scheduled</p>
            <p className="text-xl font-black text-[#26352D] mt-1">
              {requests.filter((r) => r.status === 'SCHEDULED').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] shadow-xs col-span-2 sm:col-span-1">
            <p className="text-[10px] font-bold text-emerald-700 uppercase">Completed</p>
            <p className="text-xl font-black text-emerald-700 mt-1">
              {requests.filter((r) => r.status === 'COMPLETED').length}
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E5DF] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#647067] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by business, phone, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF] text-xs text-[#26352D] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#E66A32]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-[#647067] shrink-0" />
            {['ALL', 'PENDING', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-[#26352D] text-white'
                    : 'bg-[#FAF7F2] text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
                }`}
              >
                {st === 'ALL' ? 'All Requests' : STATUS_CONFIG[st as ReelRequestStatus]?.label || st}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E5DF]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#E66A32] mx-auto mb-2" />
            <p className="text-xs text-[#647067] font-semibold">Loading reel requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E5DF] space-y-2">
            <Video className="w-8 h-8 text-[#647067] mx-auto opacity-50" />
            <p className="text-sm font-bold text-[#26352D]">No reel requests found</p>
            <p className="text-xs text-[#647067]">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or filter.'
                : 'New requests submitted from the homepage will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => {
              const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
              const isEditing = editingId === req.id;

              return (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs space-y-4 hover:border-[#647067] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-extrabold text-[#26352D]">
                          {req.businessName}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.bg} ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                        <span className="text-[10px] text-[#647067]">
                          Ref: #{req.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#647067]">
                        <span className="font-semibold text-[#26352D]">Category: {req.businessCategory}</span>
                        <span>•</span>
                        <span>Purpose: <strong className="text-[#26352D] uppercase">{req.reelPurpose.replace('_', ' ')}</strong></span>
                        <span>•</span>
                        <span>Language: <strong className="text-[#26352D]">{req.preferredLanguage}</strong></span>
                        <span>•</span>
                        <span>Submitted: {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Actions & Status Dropdown */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as ReelRequestStatus)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E8E5DF] bg-[#FAF7F2] text-xs font-bold text-[#26352D] focus:outline-none focus:border-[#E66A32]"
                      >
                        <option value="PENDING">Mark: New Request</option>
                        <option value="CONTACTED">Mark: Contacted</option>
                        <option value="SCHEDULED">Mark: Shoot Scheduled</option>
                        <option value="COMPLETED">Mark: Completed</option>
                        <option value="CANCELLED">Mark: Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Requirements Note */}
                  {req.additionalRequirements && (
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-xs">
                      <p className="font-bold text-[#26352D] mb-0.5">Business Requirements:</p>
                      <p className="text-[#647067] whitespace-pre-wrap">{req.additionalRequirements}</p>
                    </div>
                  )}

                  {/* Contact Toolbar & Admin Follow-ups */}
                  <div className="pt-2 border-t border-[#E8E5DF] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.contactPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26352D] text-white font-bold hover:bg-[#1C2721] transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#E66A32]" />
                        <span>Call {req.contactPhone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${req.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${req.businessName}, this is regarding your Instant Reel request on Royal Korutla.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 text-white" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <input
                            type="text"
                            placeholder="Admin notes / Follow-up..."
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-[#E8E5DF] text-xs text-[#26352D] bg-white w-48 sm:w-64"
                          />
                          <input
                            type="date"
                            value={editFollowUpDate}
                            onChange={(e) => setEditFollowUpDate(e.target.value)}
                            className="px-2 py-1 rounded-lg border border-[#E8E5DF] text-xs text-[#26352D] bg-white"
                          />
                          <button
                            onClick={() => handleSaveNotes(req.id)}
                            disabled={savingNotes}
                            className="px-3 py-1 rounded-lg bg-[#E66A32] text-white font-bold hover:bg-[#D45B25] flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {req.followUpDate && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                              <Calendar className="w-3 h-3" />
                              Shoot / Follow-up: {req.followUpDate}
                            </span>
                          )}

                          {req.adminNotes ? (
                            <span className="text-[11px] text-[#647067] italic max-w-xs truncate" title={req.adminNotes}>
                              Notes: {req.adminNotes}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#647067]/60">No admin notes</span>
                          )}

                          <button
                            onClick={() => startEditNotes(req)}
                            className="p-1 rounded-md text-[#647067] hover:text-[#26352D] hover:bg-[#FAF7F2]"
                            title="Edit notes & shoot schedule"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
