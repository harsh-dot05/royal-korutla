'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Camera,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Globe,
  Calendar,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { CommunityPhoto, CommunityPhotoCategory, CommunityPhotoStatus } from '@/types';
import { COMMUNITY_PHOTO_CATEGORIES } from '@/lib/communityPhotographyStore';

export const CommunityPhotoModeration: React.FC = () => {
  const [photos, setPhotos] = useState<CommunityPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<CommunityPhotoStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Form / Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<CommunityPhoto | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<CommunityPhotoCategory>('Streets & Landmarks');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAltText, setFormAltText] = useState('');
  const [formPhotographer, setFormPhotographer] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formLocation, setFormLocation] = useState('Korutla Town');
  const [formInstagram, setFormInstagram] = useState('');
  const [formPortfolio, setFormPortfolio] = useState('');
  const [formPermissionConfirmed, setFormPermissionConfirmed] = useState(false);
  const [formPermissionNotes, setFormPermissionNotes] = useState('');
  const [formStatus, setFormStatus] = useState<CommunityPhotoStatus>('PENDING');
  const [formIsPublished, setFormIsPublished] = useState(false);
  const [formFeaturedOnHome, setFormFeaturedOnHome] = useState(false);

  // Rejection modal
  const [rejectionModalPhoto, setRejectionModalPhoto] = useState<CommunityPhoto | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Permission record modal for quick approval
  const [approvalModalPhoto, setApprovalModalPhoto] = useState<CommunityPhoto | null>(null);
  const [approvalPermissionNotes, setApprovalPermissionNotes] = useState('');
  const [approvalPublishNow, setApprovalPublishNow] = useState(true);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('rk_session_token') : null;
      const headers: Record<string, string> = {};
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      const res = await fetch('/api/admin/photography/community', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPhotos(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch community photos for moderation', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const resetForm = () => {
    setEditingPhoto(null);
    setFormTitle('');
    setFormCategory('Streets & Landmarks');
    setFormImageUrl('');
    setFormAltText('');
    setFormPhotographer('');
    setFormCaption('');
    setFormLocation('Korutla Town');
    setFormInstagram('');
    setFormPortfolio('');
    setFormPermissionConfirmed(false);
    setFormPermissionNotes('');
    setFormStatus('PENDING');
    setFormIsPublished(false);
    setFormFeaturedOnHome(false);
    setShowFormModal(false);
  };

  const handleEditClick = (photo: CommunityPhoto) => {
    setEditingPhoto(photo);
    setFormTitle(photo.title);
    setFormCategory(photo.category);
    setFormImageUrl(photo.imageUrl);
    setFormAltText(photo.altText);
    setFormPhotographer(photo.photographerName);
    setFormCaption(photo.caption || '');
    setFormLocation(photo.location || '');
    setFormInstagram(photo.instagram || '');
    setFormPortfolio(photo.portfolioUrl || '');
    setFormPermissionConfirmed(photo.permissionConfirmed);
    setFormPermissionNotes(photo.permissionNotes || '');
    setFormStatus(photo.status);
    setFormIsPublished(photo.isPublished);
    setFormFeaturedOnHome(Boolean(photo.featuredOnHome));
    setShowFormModal(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formIsPublished && !formPermissionConfirmed) {
      alert('Explicit publication permission must be recorded before publishing any community photograph.');
      return;
    }

    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('rk_session_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      const payload = {
        id: editingPhoto ? editingPhoto.id : undefined,
        title: formTitle,
        category: formCategory,
        imageUrl: formImageUrl,
        altText: formAltText || formTitle,
        photographerName: formPhotographer,
        caption: formCaption,
        location: formLocation,
        instagram: formInstagram,
        portfolioUrl: formPortfolio,
        permissionConfirmed: formPermissionConfirmed,
        permissionNotes: formPermissionNotes,
        status: formStatus,
        isPublished: formIsPublished && formPermissionConfirmed && formStatus === 'APPROVED',
        featuredOnHome: formFeaturedOnHome,
      };

      const method = editingPhoto ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/photography/community', {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchPhotos();
      } else {
        alert(data.message || 'Error saving photograph');
      }
    } catch (e) {
      console.error('Error saving photo:', e);
      alert('Failed to save photo.');
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this community photograph?')) return;
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('rk_session_token') : null;
      const headers: Record<string, string> = {};
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      const res = await fetch(`/api/admin/photography/community?id=${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        fetchPhotos();
      } else {
        alert(data.message || 'Failed to delete photo');
      }
    } catch (e) {
      console.error('Error deleting photo:', e);
    }
  };

  const handleTogglePublish = async (photo: CommunityPhoto) => {
    if (!photo.isPublished && (!photo.permissionConfirmed || photo.status !== 'APPROVED')) {
      alert('A photo must have APPROVED status and recorded permission before it can be published.');
      return;
    }

    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('rk_session_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      const res = await fetch('/api/admin/photography/community', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: photo.id,
          isPublished: !photo.isPublished,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPhotos();
      }
    } catch (e) {
      console.error('Toggle publish error:', e);
    }
  };

  const submitApproval = async () => {
    if (!approvalModalPhoto) return;
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('rk_session_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      const res = await fetch('/api/admin/photography/community', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: approvalModalPhoto.id,
          status: 'APPROVED',
          permissionConfirmed: true,
          permissionNotes: approvalPermissionNotes || 'Verified consent granted by photographer via WhatsApp/Email',
          isPublished: approvalPublishNow,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApprovalModalPhoto(null);
        setApprovalPermissionNotes('');
        fetchPhotos();
      }
    } catch (e) {
      console.error('Approval error:', e);
    }
  };

  const submitRejection = async () => {
    if (!rejectionModalPhoto) return;
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('rk_session_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      const res = await fetch('/api/admin/photography/community', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: rejectionModalPhoto.id,
          status: 'REJECTED',
          isPublished: false,
          rejectionReason: rejectionReason || 'Does not meet community showcase guidelines',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRejectionModalPhoto(null);
        setRejectionReason('');
        fetchPhotos();
      }
    } catch (e) {
      console.error('Rejection error:', e);
    }
  };

  const filteredPhotos = photos.filter((photo) => {
    const matchesStatus = statusFilter === 'ALL' || photo.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || photo.category === categoryFilter;
    const matchesSearch =
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.photographerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.location && photo.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const counts = {
    total: photos.length,
    pending: photos.filter((p) => p.status === 'PENDING').length,
    approved: photos.filter((p) => p.status === 'APPROVED').length,
    published: photos.filter((p) => p.isPublished).length,
    rejected: photos.filter((p) => p.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
          <p className="text-[11px] font-bold text-[#647067] uppercase tracking-wider">Total Submissions</p>
          <p className="text-2xl font-extrabold text-[#26352D] mt-1">{counts.total}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Review</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{counts.pending}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Live in Gallery</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{counts.published}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
          <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{counts.rejected}</p>
        </div>
      </div>

      {/* Action Controls & Filters */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[#26352D] text-white'
                  : 'bg-[#FAF7F2] text-[#647067] hover:text-[#26352D]'
              }`}
            >
              All ({counts.total})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#FAF7F2] text-amber-700 hover:text-amber-800'
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'APPROVED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FAF7F2] text-emerald-700 hover:text-emerald-800'
              }`}
            >
              Approved ({counts.approved})
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'REJECTED'
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#FAF7F2] text-rose-700 hover:text-rose-800'
              }`}
            >
              Rejected ({counts.rejected})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPhotos}
              className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#647067] border border-[#E8E5DF] transition-colors cursor-pointer"
              title="Refresh submissions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowFormModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Submission</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8E5DF]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#647067]" />
            <input
              type="text"
              placeholder="Search title, photographer, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl text-xs text-[#26352D] focus:outline-none focus:border-[#E66A32]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl text-xs text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
          >
            <option value="All">All Categories</option>
            {COMMUNITY_PHOTO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#647067] bg-white rounded-2xl border border-[#E8E5DF]">
          Loading community submissions...
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-[#E8E5DF]">
          <Camera className="w-8 h-8 text-[#647067] mx-auto stroke-[1.5]" />
          <p className="text-xs font-semibold text-[#26352D]">No photographs found matching current filters.</p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setCategoryFilter('All');
              setSearchQuery('');
            }}
            className="text-xs text-[#E66A32] font-bold hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              {/* Photo & Metadata */}
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] overflow-hidden shrink-0">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.altText || photo.title}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-sm text-[#26352D]">{photo.title}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#26352D] text-[10px] font-bold border border-[#E8E5DF]">
                      {photo.category}
                    </span>
                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        photo.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : photo.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {photo.status}
                    </span>
                    {/* Published State */}
                    {photo.isPublished ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#26352D] text-white text-[10px] font-bold">
                        Live on Site
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        Unpublished
                      </span>
                    )}
                  </div>

                  {/* Credits & Location */}
                  <div className="flex items-center gap-3 text-xs text-[#647067] flex-wrap">
                    <span className="font-bold text-[#26352D]">By: {photo.photographerName}</span>
                    {photo.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#E66A32]" />
                        <span>{photo.location}</span>
                      </span>
                    )}
                    {photo.instagram && (
                      <span className="text-[11px] text-[#E66A32] font-semibold">{photo.instagram}</span>
                    )}
                  </div>

                  {/* Caption preview */}
                  {photo.caption && (
                    <p className="text-xs text-[#647067] line-clamp-1 italic">&ldquo;{photo.caption}&rdquo;</p>
                  )}

                  {/* Permission Audit Indicator */}
                  <div className="pt-1 flex items-center gap-2 text-[11px]">
                    {photo.permissionConfirmed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Permission Recorded ({photo.permissionNotes || 'Explicit Consent'})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Permission Pending — Cannot Publish</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
                {/* Approve Action */}
                {photo.status !== 'APPROVED' && (
                  <button
                    onClick={() => {
                      setApprovalModalPhoto(photo);
                      setApprovalPermissionNotes(photo.permissionNotes || 'Verified consent granted by photographer via WhatsApp');
                      setApprovalPublishNow(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {/* Reject Action */}
                {photo.status !== 'REJECTED' && (
                  <button
                    onClick={() => {
                      setRejectionModalPhoto(photo);
                      setRejectionReason(photo.rejectionReason || '');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                {/* Publish Toggle (Only active if approved & permission confirmed) */}
                {photo.status === 'APPROVED' && (
                  <button
                    onClick={() => handleTogglePublish(photo)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      photo.isPublished
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        : 'bg-[#E66A32] hover:bg-[#D45B25] text-white shadow-xs'
                    }`}
                  >
                    {photo.isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>
                )}

                {/* Edit Button */}
                <button
                  onClick={() => handleEditClick(photo)}
                  className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] border border-[#E8E5DF] transition-colors cursor-pointer"
                  title="Edit details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 transition-colors cursor-pointer"
                  title="Delete permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record / Edit Submission Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#26352D]/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E8E5DF] shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
              <h3 className="text-base font-extrabold text-[#26352D] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E66A32]" />
                <span>{editingPhoto ? 'Edit Community Photograph' : 'Record New Community Submission'}</span>
              </h3>
              <button onClick={resetForm} className="text-xs text-[#647067] hover:text-[#26352D] font-bold cursor-pointer">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset at Korutla Lake"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CommunityPhotoCategory)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                  >
                    {COMMUNITY_PHOTO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Photographer Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Photography"
                    value={formPhotographer}
                    onChange={(e) => setFormPhotographer(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Location in / around Korutla</label>
                  <input
                    type="text"
                    placeholder="e.g. Temple Road / Old Town, Korutla"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#26352D] font-bold mb-1">Image Storage URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or storage URL"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div>
                <label className="block text-[#26352D] font-bold mb-1">Accessible Alt Text</label>
                <input
                  type="text"
                  placeholder="Describe the image content for screen readers"
                  value={formAltText}
                  onChange={(e) => setFormAltText(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div>
                <label className="block text-[#26352D] font-bold mb-1">Story / Caption (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Tell the story behind this photograph..."
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Instagram Handle / URL</label>
                  <input
                    type="text"
                    placeholder="@photographer_handle"
                    value={formInstagram}
                    onChange={(e) => setFormInstagram(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
                <div>
                  <label className="block text-[#26352D] font-bold mb-1">Portfolio Website URL</label>
                  <input
                    type="url"
                    placeholder="https://photographer.com"
                    value={formPortfolio}
                    onChange={(e) => setFormPortfolio(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
              </div>

              {/* Permission & Moderation Box */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E66A32]" />
                  <span className="font-extrabold text-[#26352D]">Permission &amp; Moderation Record</span>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPermissionConfirmed}
                    onChange={(e) => setFormPermissionConfirmed(e.target.checked)}
                    className="mt-0.5 rounded accent-[#E66A32]"
                  />
                  <span className="text-xs text-[#26352D] font-bold">
                    Explicit Publication Permission Confirmed *
                    <span className="block text-[11px] font-normal text-[#647067]">
                      Photographer explicitly confirmed copyright ownership and granted permission for public display with attribution.
                    </span>
                  </span>
                </label>

                <div>
                  <label className="block text-[#647067] font-bold text-[11px] mb-1">Permission Verification Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Consent confirmed via WhatsApp (+91 98480xxxxx) on 2026-10-24"
                    value={formPermissionNotes}
                    onChange={(e) => setFormPermissionNotes(e.target.value)}
                    className="w-full bg-white border border-[#E8E5DF] rounded-xl px-3 py-1.5 text-xs text-[#26352D] focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E8E5DF]">
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">Moderation Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as CommunityPhotoStatus)}
                      className="w-full bg-white border border-[#E8E5DF] rounded-xl px-2.5 py-1.5 font-bold"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="form-publish-checkbox"
                      disabled={!formPermissionConfirmed || formStatus !== 'APPROVED'}
                      checked={formIsPublished}
                      onChange={(e) => setFormIsPublished(e.target.checked)}
                      className="rounded accent-[#E66A32]"
                    />
                    <label htmlFor="form-publish-checkbox" className="font-bold text-[#26352D] cursor-pointer">
                      Publish to Gallery
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="form-home-checkbox"
                      checked={formFeaturedOnHome}
                      onChange={(e) => setFormFeaturedOnHome(e.target.checked)}
                      className="rounded accent-[#E66A32]"
                    />
                    <label htmlFor="form-home-checkbox" className="font-bold text-[#26352D] cursor-pointer">
                      Feature on Home
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#647067] font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold transition-colors shadow-xs cursor-pointer"
                >
                  {editingPhoto ? 'Update Photograph' : 'Record Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {approvalModalPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#26352D]/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E8E5DF] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#26352D] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Approve &amp; Record Permission</span>
            </h3>
            <p className="text-xs text-[#647067] leading-relaxed">
              Approving <strong>&ldquo;{approvalModalPhoto.title}&rdquo;</strong> by{' '}
              <strong>{approvalModalPhoto.photographerName}</strong>.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-[#26352D] font-bold">Permission Audit Notes *</label>
              <input
                type="text"
                value={approvalPermissionNotes}
                onChange={(e) => setApprovalPermissionNotes(e.target.value)}
                placeholder="e.g. Consent verified via WhatsApp from +91 98480xxxxx"
                className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
              />
              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={approvalPublishNow}
                  onChange={(e) => setApprovalPublishNow(e.target.checked)}
                  className="rounded accent-[#E66A32]"
                />
                <span className="text-xs font-bold text-[#26352D]">Publish immediately to live gallery</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setApprovalModalPhoto(null)}
                className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#647067] font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModalPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#26352D]/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E8E5DF] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#26352D] flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Reject Submission</span>
            </h3>
            <p className="text-xs text-[#647067] leading-relaxed">
              Rejecting <strong>&ldquo;{rejectionModalPhoto.title}&rdquo;</strong>.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-[#26352D] font-bold">Reason for Rejection</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Unverified subjects without consent, poor resolution, or not relevant to Korutla"
                className="w-full bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl px-3 py-2 text-[#26352D] font-semibold focus:outline-none focus:border-[#E66A32]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalPhoto(null)}
                className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#647067] font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
