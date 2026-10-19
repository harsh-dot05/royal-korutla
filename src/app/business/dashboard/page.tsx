'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  LocalBusiness,
  BusinessProductService,
  BusinessOfferItem,
  BusinessEnquiry,
  BusinessOrder,
  BusinessSubscription,
  ReelRequest,
  CategorySlug,
  UserSession,
} from '@/types';
import {
  Store,
  Crown,
  Eye,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Package,
  Tag,
  MessageSquare,
  Video,
  ShieldCheck,
  LogOut,
  RefreshCw,
  X,
  ChevronRight,
  Layers,
  Calendar,
  Globe2,
} from 'lucide-react';
import {
  getRoyalKorutlaWhatsAppUrl,
  ROYAL_KORUTLA_PHONE_DISPLAY,
} from '@/config/contact';

type DashboardTab =
  | 'overview'
  | 'profile'
  | 'products'
  | 'offers'
  | 'enquiries'
  | 'orders'
  | 'reels'
  | 'subscription';

export default function BusinessDashboardPage() {
  const router = useRouter();

  // Navigation State
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Core Data States
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [business, setBusiness] = useState<LocalBusiness | null>(null);
  const [products, setProducts] = useState<BusinessProductService[]>([]);
  const [offers, setOffers] = useState<BusinessOfferItem[]>([]);
  const [enquiries, setEnquiries] = useState<BusinessEnquiry[]>([]);
  const [orders, setOrders] = useState<BusinessOrder[]>([]);
  const [reels, setReels] = useState<ReelRequest[]>([]);
  const [subscription, setSubscription] = useState<BusinessSubscription | null>(null);

  // Status & Feedback States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Forms & Modal States
  const [profileForm, setProfileForm] = useState<Partial<LocalBusiness>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BusinessProductService | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    priceDisplay: '',
    category: '',
    image: '',
    isAvailable: true,
    isService: false,
    isVeg: false,
  });

  // Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<BusinessOfferItem | null>(null);
  const [offerForm, setOfferForm] = useState({
    title: '',
    discount: '',
    code: '',
    startDate: '',
    expiry: '',
    terms: '',
    isActive: true,
    image: '',
    tag: 'SPECIAL OFFER',
  });

  // Reel Request Modal State
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [reelForm, setReelForm] = useState({
    reelPurpose: 'product_promotion' as ReelRequest['reelPurpose'],
    preferredLanguage: 'Telugu' as 'Telugu' | 'English',
    additionalRequirements: '',
  });

  // Enquiry Note Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<BusinessEnquiry | null>(null);
  const [enquiryResponseNote, setEnquiryResponseNote] = useState('');

  // Toast Helper
  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Fetch all dashboard data from real APIs
  const fetchDashboardData = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setRefreshing(true);
    }

    try {
      // 1. Fetch Current User & Business Info
      const meRes = await fetch('/api/business/me');
      if (meRes.status === 401 || meRes.status === 403) {
        router.push('/business/login');
        return;
      }
      const meData = await meRes.json();
      if (!meData.success) {
        router.push('/business/login');
        return;
      }

      setCurrentUser(meData.user);
      setBusiness(meData.business);
      if (meData.business) {
        setProfileForm(meData.business);
      }

      // 2. Fetch Dependent Stores Concurrently
      const [prodRes, offRes, enqRes, ordRes, reelRes, subRes] = await Promise.all([
        fetch('/api/business/products'),
        fetch('/api/business/offers'),
        fetch('/api/business/enquiries'),
        fetch('/api/business/orders'),
        fetch('/api/business/reels'),
        fetch('/api/business/subscription'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success) setProducts(prodData.data);
      }
      if (offRes.ok) {
        const offData = await offRes.json();
        if (offData.success) setOffers(offData.data);
      }
      if (enqRes.ok) {
        const enqData = await enqRes.json();
        if (enqData.success) setEnquiries(enqData.data);
      }
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        if (ordData.success) setOrders(ordData.data);
      }
      if (reelRes.ok) {
        const reelData = await reelRes.json();
        if (reelData.success) setReels(reelData.data);
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        if (subData.success) setSubscription(subData.data);
      }
    } catch {
      showToast('Error syncing dashboard data. Please check connection.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router, showToast]);

  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/business/logout', { method: 'POST' });
      router.push('/business/login');
      router.refresh();
    } catch {
      router.push('/business/login');
    }
  };

  // ==================== PROFILE HANDLERS ====================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const res = await fetch('/api/business/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to update profile.', 'error');
        return;
      }

      setBusiness(data.data);
      showToast('Store profile updated successfully!');
    } catch {
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ==================== PRODUCT HANDLERS ====================
  const handleOpenProductModal = (product?: BusinessProductService) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        priceDisplay: product.priceDisplay || `₹${product.price}`,
        category: product.category,
        image: product.image,
        isAvailable: product.isAvailable,
        isService: Boolean(product.isService),
        isVeg: Boolean(product.isVeg),
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: 100,
        priceDisplay: '₹100',
        category: business?.categorySlug === 'food' ? 'Biryani & Rice' : 'General',
        image: business?.image || '',
        isAvailable: true,
        isService: business?.categorySlug === 'services',
        isVeg: false,
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const payload = editingProduct ? { id: editingProduct.id, ...productForm } : productForm;

      const res = await fetch('/api/business/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to save product.', 'error');
        return;
      }

      if (editingProduct) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? data.data : p)));
        showToast('Item updated successfully!');
      } else {
        setProducts([data.data, ...products]);
        showToast('Item created and published to catalog!');
      }

      setIsProductModalOpen(false);
    } catch {
      showToast('Network error saving item.', 'error');
    }
  };

  const handleToggleProductAvailability = async (product: BusinessProductService) => {
    try {
      const res = await fetch('/api/business/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, isAvailable: !product.isAvailable }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(products.map((p) => (p.id === product.id ? data.data : p)));
        showToast(
          `Item marked as ${!product.isAvailable ? 'Available' : 'Unavailable (Out of Stock)'}`
        );
      }
    } catch {
      showToast('Could not update availability.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this catalog item?')) return;

    try {
      const res = await fetch(`/api/business/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(products.filter((p) => p.id !== id));
        showToast('Item deleted from catalog.');
      } else {
        showToast(data.message || 'Could not delete item.', 'error');
      }
    } catch {
      showToast('Failed to delete item.', 'error');
    }
  };

  // ==================== OFFER HANDLERS ====================
  const handleOpenOfferModal = (offer?: BusinessOfferItem) => {
    if (offer) {
      setEditingOffer(offer);
      setOfferForm({
        title: offer.title,
        discount: offer.discount,
        code: offer.code || '',
        startDate: offer.startDate || new Date().toISOString().split('T')[0],
        expiry: offer.expiry || '',
        terms: offer.terms || '',
        isActive: offer.isActive,
        image: offer.image || '',
        tag: offer.tag || 'SPECIAL OFFER',
      });
    } else {
      setEditingOffer(null);
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      setOfferForm({
        title: '',
        discount: '15% OFF',
        code: 'ROYAL15',
        startDate: today,
        expiry: nextMonth,
        terms: 'Valid on orders placed through Royal Korutla or in-store.',
        isActive: true,
        image: business?.image || '',
        tag: 'SPECIAL OFFER',
      });
    }
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingOffer ? 'PUT' : 'POST';
      const payload = editingOffer ? { id: editingOffer.id, ...offerForm } : offerForm;

      const res = await fetch('/api/business/offers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to save offer.', 'error');
        return;
      }

      if (editingOffer) {
        setOffers(offers.map((o) => (o.id === editingOffer.id ? data.data : o)));
        showToast('Offer updated successfully!');
      } else {
        setOffers([data.data, ...offers]);
        showToast('Offer published on Royal Korutla!');
      }

      setIsOfferModalOpen(false);
    } catch {
      showToast('Network error saving offer.', 'error');
    }
  };

  const handleToggleOfferActive = async (offer: BusinessOfferItem) => {
    try {
      const res = await fetch('/api/business/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: offer.id, isActive: !offer.isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOffers(offers.map((o) => (o.id === offer.id ? data.data : o)));
        showToast(`Offer ${!offer.isActive ? 'Activated' : 'Paused'}`);
      }
    } catch {
      showToast('Could not toggle offer status.', 'error');
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const res = await fetch(`/api/business/offers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOffers(offers.filter((o) => o.id !== id));
        showToast('Offer deleted.');
      } else {
        showToast(data.message || 'Could not delete offer.', 'error');
      }
    } catch {
      showToast('Failed to delete offer.', 'error');
    }
  };

  // ==================== ENQUIRY HANDLERS ====================
  const handleUpdateEnquiryStatus = async (
    enquiryId: string,
    newStatus: BusinessEnquiry['status'],
    notes?: string
  ) => {
    try {
      const res = await fetch('/api/business/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: enquiryId, status: newStatus, responseNotes: notes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries(enquiries.map((e) => (e.id === enquiryId ? data.data : e)));
        showToast(`Enquiry marked as ${newStatus}`);
        setSelectedEnquiry(null);
      }
    } catch {
      showToast('Could not update enquiry status.', 'error');
    }
  };

  // ==================== ORDER HANDLERS ====================
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: BusinessOrder['status']
  ) => {
    try {
      const res = await fetch('/api/business/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(orders.map((o) => (o.id === orderId ? data.data : o)));
        showToast(`Order status updated to ${newStatus}`);
      }
    } catch {
      showToast('Failed to update order status.', 'error');
    }
  };

  // ==================== REEL REQUEST HANDLERS ====================
  const handleSaveReelRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/business/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reelForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReels([data.data, ...reels]);
        showToast('Instant Reel request submitted! Media team will contact you.');
        setIsReelModalOpen(false);
      } else {
        showToast(data.message || 'Failed to submit reel request.', 'error');
      }
    } catch {
      showToast('Could not submit reel request.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D] font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-10 h-10 border-3 border-[#E8E5DF] border-t-[#E66A32] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#647067]">
            Loading Royal Korutla Business Dashboard...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D] font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#E66A32]" />
          <h2 className="text-xl font-bold">No Authorized Business Found</h2>
          <p className="text-sm text-[#647067] max-w-md">
            Your login does not currently have a linked business profile. Please contact the Royal Korutla admin team.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-[#26352D] text-white text-xs font-bold"
          >
            Sign Out
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D] font-sans antialiased">
      <Header />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 transition-all ${
            toastMessage.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Header Card */}
        <div className="rounded-2xl border border-[#E8E5DF] bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E5DF] shrink-0">
                {business.image ? (
                  <Image
                    src={business.image}
                    alt={business.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <Store className="w-8 h-8 text-[#647067] m-auto" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[11px] font-bold text-[#E66A32]">
                    <Crown className="w-3 h-3 text-[#E66A32]" />
                    <span>Verified Merchant</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#647067] uppercase tracking-wider">
                    {business.categorySlug} • {business.subCategory}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#26352D] tracking-tight">
                  {business.name}
                </h1>
                <p className="text-xs text-[#647067] flex flex-wrap items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                  <span>
                    {business.address} ({business.landmark})
                  </span>
                  {currentUser && (
                    <span className="font-medium text-[#26352D]">
                      • Owner: <span className="font-bold">{currentUser.name}</span>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions on Top Header */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8E5DF]">
              <button
                onClick={() => fetchDashboardData(false)}
                disabled={refreshing}
                title="Refresh dashboard data"
                className="p-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] hover:bg-[#F4EFE7] text-[#26352D] text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <Link
                href={`/businesses/${business.id}`}
                target="_blank"
                className="px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] hover:bg-[#F4EFE7] text-[#26352D] font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#26352D]" />
                <span>View Public Page</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar (Mobile Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#E8E5DF]">
          {[
            { id: 'overview', label: 'Overview', icon: Layers },
            { id: 'profile', label: 'Store Profile', icon: Edit3 },
            { id: 'products', label: `Catalog (${products.length})`, icon: Package },
            { id: 'offers', label: `Offers (${offers.length})`, icon: Tag },
            { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Clock },
            { id: 'reels', label: `Instant Reels (${reels.length})`, icon: Video },
            { id: 'subscription', label: 'Plan & Billing', icon: Crown },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-[#26352D] text-white shadow-xs'
                    : 'bg-white text-[#647067] hover:text-[#26352D] hover:bg-[#F4EFE7] border border-[#E8E5DF]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E66A32]' : 'text-[#647067]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E5DF] shadow-xs space-y-1">
                <span className="text-[11px] text-[#647067] font-semibold uppercase tracking-wider block">
                  Catalog Items
                </span>
                <p className="text-2xl font-black text-[#26352D]">{products.length}</p>
                <p className="text-[11px] text-[#647067]">
                  {products.filter((p) => p.isAvailable).length} active for order
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E5DF] shadow-xs space-y-1">
                <span className="text-[11px] text-[#647067] font-semibold uppercase tracking-wider block">
                  Active Offers
                </span>
                <p className="text-2xl font-black text-[#E66A32]">
                  {offers.filter((o) => o.isActive).length}
                </p>
                <p className="text-[11px] text-[#647067]">Published on discounts page</p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E5DF] shadow-xs space-y-1">
                <span className="text-[11px] text-[#647067] font-semibold uppercase tracking-wider block">
                  Customer Enquiries
                </span>
                <p className="text-2xl font-black text-[#26352D]">{enquiries.length}</p>
                <p className="text-[11px] text-[#E66A32] font-semibold">
                  {enquiries.filter((e) => e.status === 'NEW').length} pending response
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E5DF] shadow-xs space-y-1">
                <span className="text-[11px] text-[#647067] font-semibold uppercase tracking-wider block">
                  Orders Received
                </span>
                <p className="text-2xl font-black text-[#26352D]">{orders.length}</p>
                <p className="text-[11px] text-[#647067]">
                  ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('en-IN')} total volume
                </p>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => handleOpenProductModal()}
                className="cursor-pointer bg-white rounded-2xl p-5 border border-[#E8E5DF] hover:border-[#E66A32] transition-colors shadow-xs flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#26352D] group-hover:text-[#E66A32] flex items-center gap-1.5 transition-colors">
                    <Plus className="w-4 h-4 text-[#E66A32]" />
                    <span>Add Item to Catalog</span>
                  </span>
                  <p className="text-[11px] text-[#647067]">
                    Add food items, retail products, or services.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#647067] group-hover:translate-x-1 transition-transform" />
              </div>

              <div
                onClick={() => handleOpenOfferModal()}
                className="cursor-pointer bg-white rounded-2xl p-5 border border-[#E8E5DF] hover:border-[#E66A32] transition-colors shadow-xs flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#26352D] group-hover:text-[#E66A32] flex items-center gap-1.5 transition-colors">
                    <Tag className="w-4 h-4 text-[#E66A32]" />
                    <span>Post Discount Coupon</span>
                  </span>
                  <p className="text-[11px] text-[#647067]">
                    Create promo codes with valid dates & terms.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#647067] group-hover:translate-x-1 transition-transform" />
              </div>

              <div
                onClick={() => setIsReelModalOpen(true)}
                className="cursor-pointer bg-white rounded-2xl p-5 border border-[#E8E5DF] hover:border-[#E66A32] transition-colors shadow-xs flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#26352D] group-hover:text-[#E66A32] flex items-center gap-1.5 transition-colors">
                    <Video className="w-4 h-4 text-[#E66A32]" />
                    <span>Book 4K Instant Reel</span>
                  </span>
                  <p className="text-[11px] text-[#647067]">
                    Get an in-store promotional video for Instagram & RK.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#647067] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Split Row: Recent Orders & Recent Enquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Box */}
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#E66A32]" />
                    <h3 className="text-xs font-bold text-[#26352D] uppercase tracking-wider">
                      Recent Orders
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-[11px] font-bold text-[#E66A32] hover:underline"
                  >
                    View All ({orders.length}) →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#647067]">
                    No orders logged yet. Customer orders placed via WhatsApp or checkout appear here.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8E5DF]">
                    {orders.slice(0, 3).map((ord) => (
                      <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-[#26352D]">#{ord.id}</div>
                          <div className="text-[11px] text-[#647067]">
                            {ord.customerName} • {ord.items.length} items
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-[#26352D]">₹{ord.totalAmount}</div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-800'
                                : ord.status === 'DISPATCHED'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF]'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Enquiries Box */}
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#E66A32]" />
                    <h3 className="text-xs font-bold text-[#26352D] uppercase tracking-wider">
                      Recent Customer Inquiries
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-[11px] font-bold text-[#E66A32] hover:underline"
                  >
                    View All ({enquiries.length}) →
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#647067]">
                    No enquiries logged yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8E5DF]">
                    {enquiries.slice(0, 3).map((enq) => (
                      <div key={enq.id} className="py-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#26352D]">{enq.customerName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              enq.status === 'NEW'
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#647067] line-clamp-1">{enq.subject}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Official Business Website & Digital Services Banner */}
            <div className="rounded-2xl p-6 sm:p-7 bg-[#26352D] text-white shadow-xs space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#E66A32]">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Dedicated Store Website &amp; Catalog</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Get an Official Business Website for {business.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
                Royal Korutla builds high-speed, mobile-optimized websites featuring your direct WhatsApp ordering catalog, Google Maps directions, and search optimization for town residents.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={getRoyalKorutlaWhatsAppUrl(
                    `Hello Royal Korutla Team, I am the owner of ${business.name}. I would like to inquire about building an official business website and WhatsApp catalog for my shop.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] text-white font-extrabold text-xs flex items-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire on WhatsApp ({ROYAL_KORUTLA_PHONE_DISPLAY})</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: STORE PROFILE EDIT */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-[#E8E5DF] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#26352D] tracking-tight">
                Edit Store Details &amp; Contact Info
              </h2>
              <p className="text-xs text-[#647067] mt-0.5">
                Keep your store address, working hours, phone number, and photos up to date on Royal Korutla.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Category *
                  </label>
                  <select
                    value={profileForm.categorySlug || 'businesses'}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        categorySlug: e.target.value as CategorySlug,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  >
                    <option value="food">Restaurants &amp; Food</option>
                    <option value="shopping">Shopping &amp; Apparel</option>
                    <option value="groceries">Groceries &amp; Daily Needs</option>
                    <option value="services">Local Home Services &amp; Repairs</option>
                    <option value="hospitals">Hospitals &amp; Clinics</option>
                    <option value="real-estate">Real Estate &amp; Plots</option>
                    <option value="jobs">Jobs &amp; Placement</option>
                    <option value="photography">Photography &amp; Studios</option>
                    <option value="education">Education &amp; Tuition</option>
                    <option value="businesses">General Local Business</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Sub-Category / Speciality
                  </label>
                  <input
                    type="text"
                    value={profileForm.subCategory || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, subCategory: e.target.value })}
                    placeholder="e.g. Biryani &amp; North Indian, Wedding Silks, AC Repair"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Owner / Manager Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.ownerName || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                    placeholder="e.g. Mohammed Ahmed"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Calling Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Verified WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.whatsapp || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Store Address in Korutla *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.address || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="e.g. Main Road, Near Old Bus Stand"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={profileForm.landmark || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, landmark: e.target.value })}
                    placeholder="e.g. Opposite State Bank of India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Working Hours / Timings *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.timing || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, timing: e.target.value })}
                    placeholder="e.g. 10:00 AM - 10:30 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Price Range Indicator
                  </label>
                  <input
                    type="text"
                    value={profileForm.priceRange || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, priceRange: e.target.value })}
                    placeholder="e.g. ₹200 - ₹500 for two"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Primary Store Photo URL
                </label>
                <input
                  type="url"
                  value={profileForm.image || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Store Description
                </label>
                <textarea
                  rows={3}
                  value={profileForm.description || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  placeholder="Briefly describe your shop, specialties, and customer service."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E5DF]">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
                >
                  {isSavingProfile ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Profile Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PRODUCTS & SERVICES */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#E8E5DF] shadow-xs">
              <div>
                <h2 className="text-base font-black text-[#26352D]">
                  Products &amp; Services Catalog
                </h2>
                <p className="text-xs text-[#647067]">
                  Manage item names, prices, tags, and instantly toggle availability.
                </p>
              </div>
              <button
                onClick={() => handleOpenProductModal()}
                className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-10 text-center space-y-3">
                <Package className="w-10 h-10 text-[#647067] mx-auto opacity-40" />
                <h3 className="text-sm font-bold text-[#26352D]">No Items in Catalog</h3>
                <p className="text-xs text-[#647067] max-w-sm mx-auto">
                  Add your dishes, merchandise, or services so customers in Korutla can browse and place WhatsApp orders.
                </p>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="px-4 py-2 rounded-xl bg-[#26352D] text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Item</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E8E5DF] overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {item.isVeg !== undefined && (
                              <span
                                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                                  item.isVeg
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-red-600 text-red-600'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                                  }`}
                                />
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-[#647067] uppercase tracking-wider">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-[#26352D] line-clamp-1">
                            {item.name}
                          </h4>
                        </div>

                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E5DF]">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-[#647067] m-auto" />
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#647067] line-clamp-2">
                        {item.description || 'No description provided.'}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-black text-[#26352D]">
                          {item.priceDisplay || `₹${item.price}`}
                        </span>

                        {/* Availability Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleProductAvailability(item)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock ✓' : 'Out of Stock ✗'}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF7F2] border-t border-[#E8E5DF] flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleOpenProductModal(item)}
                        className="font-bold text-[#26352D] hover:text-[#E66A32] flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        className="font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: OFFERS & DISCOUNTS */}
        {/* ========================================================= */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#E8E5DF] shadow-xs">
              <div>
                <h2 className="text-base font-black text-[#26352D]">
                  Promotional Offers &amp; Coupons
                </h2>
                <p className="text-xs text-[#647067]">
                  Create festival campaigns, promo codes, and special discounts for Royal Korutla users.
                </p>
              </div>
              <button
                onClick={() => handleOpenOfferModal()}
                className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Offer</span>
              </button>
            </div>

            {offers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-10 text-center space-y-3">
                <Tag className="w-10 h-10 text-[#647067] mx-auto opacity-40" />
                <h3 className="text-sm font-bold text-[#26352D]">No Active Offers</h3>
                <p className="text-xs text-[#647067] max-w-sm mx-auto">
                  Launch an attractive discount or coupon code to boost local footfall and WhatsApp inquiries.
                </p>
                <button
                  onClick={() => handleOpenOfferModal()}
                  className="px-4 py-2 rounded-xl bg-[#26352D] text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Offer</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-2xl border border-[#E8E5DF] p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32]">
                            {offer.tag || 'SPECIAL OFFER'}
                          </span>
                          <h4 className="font-extrabold text-sm text-[#26352D]">{offer.title}</h4>
                        </div>
                        <span className="text-sm font-black text-[#E66A32] bg-[#FFF6F0] px-2.5 py-1 rounded-xl border border-[#F8CFBE]">
                          {offer.discount}
                        </span>
                      </div>

                      {offer.code && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#647067]">Coupon Code:</span>
                          <span className="font-mono font-bold text-xs bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-dashed border-[#E8E5DF] text-[#26352D]">
                            {offer.code}
                          </span>
                        </div>
                      )}

                      {offer.terms && (
                        <p className="text-[11px] text-[#647067] leading-relaxed">
                          Terms: {offer.terms}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-[#647067]">
                        <Calendar className="w-3.5 h-3.5 text-[#E66A32]" />
                        <span>Valid until: {offer.expiry}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E5DF] flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleToggleOfferActive(offer)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          offer.isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {offer.isActive ? 'Active on App ✓' : 'Paused ✗'}
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenOfferModal(offer)}
                          className="font-bold text-[#26352D] hover:text-[#E66A32] flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CUSTOMER ENQUIRIES */}
        {/* ========================================================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E5DF] shadow-xs">
              <h2 className="text-base font-black text-[#26352D]">Incoming Customer Inquiries</h2>
              <p className="text-xs text-[#647067]">
                Customer requests submitted through your business profile and search listings.
              </p>
            </div>

            {enquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-10 text-center text-xs text-[#647067]">
                No customer inquiries received yet.
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="bg-white rounded-2xl border border-[#E8E5DF] p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#26352D]">{enq.customerName}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            enq.status === 'NEW'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : enq.status === 'RESPONDED'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#647067]">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#26352D]">{enq.subject}</h4>
                      <p className="text-xs text-[#647067] leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E5DF]">
                        {enq.message}
                      </p>
                    </div>

                    {enq.responseNotes && (
                      <div className="text-[11px] text-[#26352D] bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-900">Your Action Notes: </span>
                        <span>{enq.responseNotes}</span>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${enq.customerPhone}`}
                          className="px-3 py-1.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] hover:bg-[#F4EFE7] font-bold text-[#26352D] flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#26352D]" />
                          <span>Call: {enq.customerPhone}</span>
                        </a>

                        <a
                          href={getRoyalKorutlaWhatsAppUrl(
                            `Hello ${enq.customerName}, this is ${business.name} regarding your inquiry on Royal Korutla.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 font-bold text-emerald-900 flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {enq.status !== 'RESPONDED' && (
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setEnquiryResponseNote(enq.responseNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#26352D] text-white font-bold text-xs hover:bg-black transition-colors"
                          >
                            Mark Responded
                          </button>
                        )}
                        {enq.status !== 'CLOSED' && (
                          <button
                            onClick={() => handleUpdateEnquiryStatus(enq.id, 'CLOSED')}
                            className="px-3 py-1.5 rounded-xl border border-[#E8E5DF] bg-white text-[#647067] hover:text-[#26352D] font-bold text-xs transition-colors"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: ORDERS */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E5DF] shadow-xs">
              <h2 className="text-base font-black text-[#26352D]">Orders Placed With Your Store</h2>
              <p className="text-xs text-[#647067]">
                Track order delivery progress and update preparation status in real-time.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-10 text-center text-xs text-[#647067]">
                No orders logged yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-[#E8E5DF] p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E5DF] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#26352D]">#{order.id}</span>
                          <span className="text-xs text-[#647067]">•</span>
                          <span className="text-xs font-semibold text-[#647067]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="text-xs text-[#647067] mt-0.5">
                          Customer: <span className="font-bold text-[#26352D]">{order.customerName}</span> ({order.customerPhone})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#647067]">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(
                              order.id,
                              e.target.value as BusinessOrder['status']
                            )
                          }
                          className="px-3 py-1.5 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] font-bold text-xs text-[#26352D] focus:outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-[#647067] uppercase tracking-wider">
                        Ordered Items
                      </div>
                      <div className="divide-y divide-[#E8E5DF] bg-[#FAF7F2] rounded-xl p-3 border border-[#E8E5DF]">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-1.5 flex items-center justify-between text-xs first:pt-0 last:pb-0"
                          >
                            <span className="text-[#26352D] font-medium">
                              {item.quantity} × {item.name}
                            </span>
                            <span className="font-bold text-[#26352D]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E5DF]">
                      <div>
                        <span className="font-bold text-[#26352D] block">Delivery Location:</span>
                        <span className="text-[#647067]">
                          {order.deliveryAddress} {order.landmark && `(${order.landmark})`}
                        </span>
                      </div>
                      {order.notes && (
                        <div>
                          <span className="font-bold text-[#26352D] block">Customer Notes:</span>
                          <span className="text-[#647067]">{order.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-xs font-bold text-[#26352D] hover:text-[#E66A32] flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E66A32]" />
                        <span>Call Customer</span>
                      </a>
                      <div className="text-right">
                        <span className="text-[11px] text-[#647067] block">Grand Total</span>
                        <span className="text-base font-black text-[#26352D]">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: INSTANT REELS */}
        {/* ========================================================= */}
        {activeTab === 'reels' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#E8E5DF] shadow-xs">
              <div>
                <h2 className="text-base font-black text-[#26352D]">
                  Instant Reel Video Shoots
                </h2>
                <p className="text-xs text-[#647067]">
                  Track production status, videographer schedule, and requests for {business.name}.
                </p>
              </div>
              <button
                onClick={() => setIsReelModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Request New Reel Shoot</span>
              </button>
            </div>

            {reels.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-10 text-center space-y-3">
                <Video className="w-10 h-10 text-[#647067] mx-auto opacity-40" />
                <h3 className="text-sm font-bold text-[#26352D]">No Video Shoots Booked Yet</h3>
                <p className="text-xs text-[#647067] max-w-sm mx-auto">
                  Showcase your storefront, cooking process, or seasonal collection with a high-definition reel produced by Royal Korutla videographers.
                </p>
                <button
                  onClick={() => setIsReelModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#26352D] text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Reel Shoot</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reels.map((reel) => (
                  <div
                    key={reel.id}
                    className="bg-white rounded-2xl border border-[#E8E5DF] p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#26352D]">#{reel.id}</span>
                        <span className="text-xs text-[#647067]">•</span>
                        <span className="text-xs font-bold text-[#E66A32] uppercase">
                          {reel.reelPurpose.replace('_', ' ')}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          reel.status === 'SCHEDULED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : reel.status === 'CONTACTED'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-[#FAF7F2] text-[#26352D] border border-[#E8E5DF]'
                        }`}
                      >
                        Status: {reel.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#647067] space-y-1 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E5DF]">
                      <div>
                        <span className="font-bold text-[#26352D]">Preferred Language:</span>{' '}
                        {reel.preferredLanguage}
                      </div>
                      {reel.additionalRequirements && (
                        <div>
                          <span className="font-bold text-[#26352D]">Your Requirements:</span>{' '}
                          {reel.additionalRequirements}
                        </div>
                      )}
                    </div>

                    {reel.adminNotes && (
                      <div className="text-[11px] text-[#26352D] bg-[#FFF6F0] p-3 rounded-xl border border-[#F8CFBE]">
                        <span className="font-bold text-[#E66A32]">Media Team Notes: </span>
                        <span>{reel.adminNotes}</span>
                        {reel.followUpDate && (
                          <span className="block mt-1 font-semibold text-[#647067]">
                            Tentative Shoot Date: {reel.followUpDate}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: SUBSCRIPTION & PLAN */}
        {/* ========================================================= */}
        {activeTab === 'subscription' && subscription && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E8E5DF] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E5DF] pb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[11px] font-bold text-[#E66A32] mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E66A32]" />
                    <span>Verified Store Membership</span>
                  </span>
                  <h2 className="text-xl font-black text-[#26352D]">{subscription.planName}</h2>
                  <p className="text-xs text-[#647067]">
                    Current membership plan for {business.name}.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-2xl font-black text-[#26352D]">
                    {subscription.pricePerMonth > 0 ? `₹${subscription.pricePerMonth} / month` : 'Free'}
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 mt-1">
                    Payment Status: {subscription.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Renewal & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1">
                  <span className="text-[11px] text-[#647067] font-semibold uppercase tracking-wider block">
                    Next Renewal Date
                  </span>
                  <p className="text-sm font-extrabold text-[#26352D] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#E66A32]" />
                    <span>{subscription.renewalDate}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1">
                  <span className="text-[11px] text-[#647067] font-semibold uppercase tracking-wider block">
                    Membership Tier
                  </span>
                  <p className="text-sm font-extrabold text-[#26352D] flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-[#E66A32]" />
                    <span>{subscription.plan}</span>
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#26352D] uppercase tracking-wider">
                  Features Included in Your Tier
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {subscription.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-[#E8E5DF] bg-white flex items-center gap-2.5 text-xs text-[#26352D] font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade or Renew CTA */}
              <div className="pt-4 border-t border-[#E8E5DF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#647067]">
                  Want to upgrade to Platinum Royal or request homepage spotlight placement?
                </p>
                <a
                  href={getRoyalKorutlaWhatsAppUrl(
                    `Hello Royal Korutla Team, I am the owner of ${business.name}. I would like to inquire about upgrading my merchant subscription plan.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] text-white font-extrabold text-xs flex items-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Royal Korutla Support</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E5DF] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
              <h3 className="text-base font-extrabold text-[#26352D]">
                {editingProduct ? 'Edit Catalog Item' : 'Add Item to Catalog'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-[#647067] hover:text-[#26352D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Special Chicken Dum Biryani, Pure Pattu Saree"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: Number(e.target.value),
                        priceDisplay: `₹${e.target.value}`,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Category Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="e.g. Biryani, Sarees, AC Repair"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Item Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Portion size, fabric material, warranty details, etc."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#26352D]">
                  <input
                    type="checkbox"
                    checked={productForm.isAvailable}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isAvailable: e.target.checked })
                    }
                    className="rounded text-[#E66A32]"
                  />
                  <span>Available in Stock</span>
                </label>

                {business.categorySlug === 'food' && (
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800">
                    <input
                      type="checkbox"
                      checked={productForm.isVeg}
                      onChange={(e) =>
                        setProductForm({ ...productForm, isVeg: e.target.checked })
                      }
                      className="rounded text-emerald-600"
                    />
                    <span>Pure Vegetarian Item</span>
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E5DF]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E5DF] bg-white text-[#647067] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] text-white font-extrabold text-xs transition-colors shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT OFFER */}
      {/* ========================================================= */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E5DF] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
              <h3 className="text-base font-extrabold text-[#26352D]">
                {editingOffer ? 'Edit Discount Offer' : 'Create New Offer'}
              </h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="p-1 rounded-lg text-[#647067] hover:text-[#26352D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="e.g. 20% OFF Family Pack Biryani, Festive Pattu Saree Discount"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Discount Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={offerForm.discount}
                    onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                    placeholder="e.g. 20% OFF, ₹200 OFF, Free Gift"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                    Coupon Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={offerForm.code}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. ROYAL20"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] font-mono focus:bg-white focus:outline-none focus:border-[#E66A32]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Valid Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={offerForm.expiry}
                  onChange={(e) => setOfferForm({ ...offerForm, expiry: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Terms &amp; Conditions
                </label>
                <textarea
                  rows={2}
                  value={offerForm.terms}
                  onChange={(e) => setOfferForm({ ...offerForm, terms: e.target.value })}
                  placeholder="e.g. Valid on dining above ₹500. Show coupon at bill counter."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E5DF]">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E5DF] bg-white text-[#647067] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] text-white font-extrabold text-xs transition-colors shadow-xs"
                >
                  {editingOffer ? 'Save Changes' : 'Publish Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SUBMIT INSTANT REEL REQUEST */}
      {/* ========================================================= */}
      {isReelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E5DF] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
              <h3 className="text-base font-extrabold text-[#26352D]">
                Request 4K Instant Reel Shoot
              </h3>
              <button
                onClick={() => setIsReelModalOpen(false)}
                className="p-1 rounded-lg text-[#647067] hover:text-[#26352D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReelRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Reel Focus / Purpose
                </label>
                <select
                  value={reelForm.reelPurpose}
                  onChange={(e) =>
                    setReelForm({
                      ...reelForm,
                      reelPurpose: e.target.value as ReelRequest['reelPurpose'],
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                >
                  <option value="product_promotion">Product / Dish Spotlight</option>
                  <option value="shop_introduction">Store Walkthrough &amp; Ambience</option>
                  <option value="offer">Special Festive Offer Campaign</option>
                  <option value="event">Store Anniversary or Event</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Preferred Voiceover / Audio Language
                </label>
                <select
                  value={reelForm.preferredLanguage}
                  onChange={(e) =>
                    setReelForm({
                      ...reelForm,
                      preferredLanguage: e.target.value as 'Telugu' | 'English',
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                >
                  <option value="Telugu">Telugu (Local Korutla Audience)</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Special Shoot Instructions
                </label>
                <textarea
                  rows={3}
                  value={reelForm.additionalRequirements}
                  onChange={(e) =>
                    setReelForm({ ...reelForm, additionalRequirements: e.target.value })
                  }
                  placeholder="e.g. Please capture our Biryani dum opening at 1:00 PM, highlight customer family dining cabin."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E5DF]">
                <button
                  type="button"
                  onClick={() => setIsReelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E5DF] bg-white text-[#647067] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E66A32] hover:bg-[#CF5823] text-white font-extrabold text-xs transition-colors shadow-xs"
                >
                  Submit Shoot Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RESPOND TO ENQUIRY */}
      {/* ========================================================= */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E5DF] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
              <h3 className="text-base font-extrabold text-[#26352D]">
                Mark Enquiry as Responded
              </h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-[#647067] hover:text-[#26352D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-[#647067]">
                Customer: <span className="font-bold text-[#26352D]">{selectedEnquiry.customerName}</span>
                <div>Subject: {selectedEnquiry.subject}</div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26352D] uppercase tracking-wider block">
                  Action Note / Outcome (Internal Record)
                </label>
                <textarea
                  rows={3}
                  value={enquiryResponseNote}
                  onChange={(e) => setEnquiryResponseNote(e.target.value)}
                  placeholder="e.g. Called customer at 2 PM, shared catering menu on WhatsApp, quote ₹280/plate."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-[#FAF7F2] text-xs sm:text-sm text-[#26352D] focus:bg-white focus:outline-none focus:border-[#E66A32]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E5DF]">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl border border-[#E8E5DF] bg-white text-[#647067] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateEnquiryStatus(
                      selectedEnquiry.id,
                      'RESPONDED',
                      enquiryResponseNote
                    )
                  }
                  className="px-5 py-2 rounded-xl bg-[#26352D] hover:bg-black text-white font-extrabold text-xs transition-colors shadow-xs"
                >
                  Save &amp; Mark Responded
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
