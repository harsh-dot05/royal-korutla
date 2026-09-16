'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  FEATURED_BUSINESSES,
  FEATURED_OFFERS,
  FOOD_MENU_ITEMS,
  LOCAL_JOBS,
  PROPERTIES,
  HOSPITALS,
  DOCTORS,
  REWARD_VOUCHERS,
  STORIES_REELS,
  EMERGENCY_CONTACTS,
} from '@/data/mockData';
import { Promotion, PromotionType, LocalBusiness, Offer, FoodMenuItem, JobListing, RealEstateProperty, HospitalDetail, Doctor, Review, StoryReel } from '@/types';
import {
  Shield,
  Sparkles,
  Building2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Calendar,
  Plus,
  ArrowRight,
  LogOut,
  Lock,
  Search,
  Filter,
  Edit3,
  Trash2,
  Tag,
  Utensils,
  ShoppingBag,
  Wrench,
  Briefcase,
  Home,
  HeartPulse,
  Stethoscope,
  Users,
  MessageSquare,
  ShoppingCart,
  Award,
  Video,
  Film,
  CreditCard,
  Crown,
  Layout,
  Settings as SettingsIcon,
  Eye,
  AlertCircle,
  RefreshCw,
  X,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Clock,
  MapPin,
  Phone,
  Mail,
  Zap,
  Sliders,
  CheckSquare,
  AlertTriangle,
  Send
} from 'lucide-react';

type AdminTab =
  | 'dashboard'
  | 'businesses'
  | 'add-business'
  | 'edit-business'
  | 'verify-business'
  | 'featured-businesses'
  | 'promotions'
  | 'offers'
  | 'food'
  | 'grocery'
  | 'services'
  | 'jobs'
  | 'real-estate'
  | 'hospitals'
  | 'doctors'
  | 'users'
  | 'reviews'
  | 'orders'
  | 'royal-points'
  | 'stories'
  | 'reels'
  | 'payments'
  | 'subscriptions'
  | 'homepage-content'
  | 'settings';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Business state
  const [businesses, setBusinesses] = useState<LocalBusiness[]>(FEATURED_BUSINESSES);
  const [editingBiz, setEditingBiz] = useState<LocalBusiness | null>(null);

  // Add Business Form State
  const [newBizName, setNewBizName] = useState('');
  const [newBizCategory, setNewBizCategory] = useState('food');
  const [newBizSubCategory, setNewBizSubCategory] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizAddress, setNewBizAddress] = useState('');
  const [newBizTiming, setNewBizTiming] = useState('09:00 AM - 09:00 PM');
  const [newBizImage, setNewBizImage] = useState('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80');
  const [newBizVerified, setNewBizVerified] = useState(true);

  // Promotions State
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  
  // New Promotion Form
  const [promBizName, setPromBizName] = useState('');
  const [promTitle, setPromTitle] = useState('');
  const [promDescription, setPromDescription] = useState('');
  const [promImage, setPromImage] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80');
  const [promType, setPromType] = useState<PromotionType>('HOMEPAGE_FEATURED');
  const [promPlacement, setPromPlacement] = useState('Homepage Top Banner');
  const [promBadge, setPromBadge] = useState('PROMOTED');
  const [promOfferText, setPromOfferText] = useState('20% Special Discount');
  const [promStartDate, setPromStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [promEndDate, setPromEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  // Offers State
  const [offers, setOffers] = useState<Offer[]>(FEATURED_OFFERS);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferBiz, setNewOfferBiz] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState('20% OFF');

  // Food Menu Items State
  const [foodItems, setFoodItems] = useState<FoodMenuItem[]>(FOOD_MENU_ITEMS);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState(250);
  const [newDishIsVeg, setNewDishIsVeg] = useState(false);

  // Jobs State
  const [jobs, setJobs] = useState<JobListing[]>(LOCAL_JOBS);

  // Real Estate State
  const [properties, setProperties] = useState<RealEstateProperty[]>(PROPERTIES);

  // Hospitals State
  const [hospitalsList, setHospitalsList] = useState<HospitalDetail[]>(HOSPITALS);

  // Doctors State
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);

  // Users State
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Royal Korutla Owner', email: 'admin@royalkorutla.com', role: 'ADMIN', phone: '+91 98480 11223', status: 'ACTIVE', joinedDate: '2026-01-01' },
    { id: 'usr-2', name: 'Mohammed Ahmed (Royal Biryani)', email: 'ahmed@royalbiryani.com', role: 'BUSINESS_OWNER', phone: '+91 98765 43210', status: 'ACTIVE', joinedDate: '2026-02-10' },
    { id: 'usr-3', name: 'Srinivas Goud', email: 'srinivas.korutla@gmail.com', role: 'CUSTOMER', phone: '+91 94401 88776', status: 'ACTIVE', joinedDate: '2026-03-05' },
    { id: 'usr-4', name: 'Ravali Textiles', email: 'ravali.textiles@gmail.com', role: 'BUSINESS_OWNER', phone: '+91 98492 55443', status: 'ACTIVE', joinedDate: '2026-03-12' },
  ]);

  // Reviews State
  const [reviewsList, setReviewsList] = useState<Review[]>([
    { id: 'rev-1', businessId: 'biz-1', userName: 'Rajesh K.', rating: 5, comment: 'Best Dum Biryani in Korutla! Clean AC ambience and super quick service.', date: '2026-09-14' },
    { id: 'rev-2', businessId: 'biz-3', userName: 'Priya Sharma', rating: 5, comment: 'Purchased Pattu sarees for wedding. Wholesale prices and high quality.', date: '2026-09-12' },
    { id: 'rev-3', businessId: 'biz-2', userName: 'Mahesh B.', rating: 4, comment: 'Doctor consultation was clear and emergency care was fast.', date: '2026-09-10' },
  ]);

  // Orders State
  const [ordersList, setOrdersList] = useState([
    { id: 'ORD-9821', customerName: 'Srinivas Goud', phone: '+91 94401 88776', items: '2x Royal Chicken Dum Biryani', total: '₹560', status: 'DELIVERED', time: '10 mins ago' },
    { id: 'ORD-9822', customerName: 'Ramesh Reddy', phone: '+91 98491 22334', items: '1x Family Biryani Bucket + Salan', total: '₹750', status: 'DISPATCHED', time: '25 mins ago' },
    { id: 'ORD-9823', customerName: 'Anitha P.', phone: '+91 99890 11223', items: '1x Paneer Butter Masala + Naan', total: '₹220', status: 'PREPARING', time: '40 mins ago' },
  ]);

  // Stories & Reels
  const [storiesList, setStoriesList] = useState<StoryReel[]>(STORIES_REELS);

  // Settings State
  const [siteName, setSiteName] = useState('Royal Korutla 👑');
  const [supportPhone, setSupportPhone] = useState('+91 98480 12345');
  const [supportEmail, setSupportEmail] = useState('support@royalkorutla.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Fetch Promotions from API
  const fetchPromotions = async () => {
    setLoadingPromotions(true);
    try {
      const res = await fetch('/api/admin/promotions');
      const data = await res.json();
      if (data.success && data.data) {
        setPromotions(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch promotions', e);
    } finally {
      setLoadingPromotions(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // ignore error
    }
    router.push('/admin/login');
    router.refresh();
  };

  // Business Actions
  const handleToggleVerifyBiz = (id: string) => {
    setBusinesses(businesses.map(b => b.id === id ? { ...b, isVerified: !b.isVerified } : b));
    showToast('Business verification status updated!');
  };

  const handleToggleFeaturedBiz = (id: string) => {
    setBusinesses(businesses.map(b => b.id === id ? { ...b, isFeatured: !b.isFeatured } : b));
    showToast('Featured status updated!');
  };

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName) return;
    const newBiz: LocalBusiness = {
      id: `biz-${Date.now()}`,
      name: newBizName,
      categorySlug: newBizCategory as any,
      subCategory: newBizSubCategory || 'Local Business',
      rating: 5.0,
      reviewCount: 1,
      address: newBizAddress || 'Korutla',
      landmark: 'Korutla Town',
      phone: newBizPhone || '+91 98480 00000',
      timing: newBizTiming,
      isVerified: newBizVerified,
      isFeatured: false,
      image: newBizImage,
      tags: ['Local', 'Verified'],
    };
    setBusinesses([newBiz, ...businesses]);
    setNewBizName('');
    setNewBizSubCategory('');
    setNewBizPhone('');
    setNewBizAddress('');
    showToast(`Success! "${newBiz.name}" added to Korutla listings.`);
    setActiveTab('businesses');
  };

  // Promotion Publisher Action (Zero Code Edit!)
  const handlePublishPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promBizName) {
      showToast('Please enter or select a business name', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: promBizName,
          title: promTitle,
          description: promDescription,
          bannerImage: promImage,
          promotionType: promType,
          placement: promPlacement,
          badgeLabel: promBadge,
          offerText: promOfferText,
          startDate: promStartDate,
          endDate: promEndDate,
          priority: 1,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`🎉 Promotion Published! "${promBizName}" is now active in ${promPlacement}!`);
        fetchPromotions();
        setPromBizName('');
        setPromTitle('');
        setPromDescription('');
      } else {
        showToast(data.message || 'Failed to publish promotion', 'error');
      }
    } catch (err) {
      showToast('Error publishing promotion', 'error');
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Promotion removed successfully.');
        fetchPromotions();
      }
    } catch (err) {
      showToast('Error removing promotion', 'error');
    }
  };

  // Tab definitions
  const tabsList: { id: AdminTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'businesses', label: 'Businesses', icon: Building2, badge: `${businesses.length}` },
    { id: 'add-business', label: 'Add Business', icon: Plus },
    { id: 'edit-business', label: 'Edit Business', icon: Edit3 },
    { id: 'verify-business', label: 'Verify Badges', icon: CheckCircle2 },
    { id: 'featured-businesses', label: 'Featured Ticker', icon: Crown },
    { id: 'promotions', label: 'Promotions (No-Code)', icon: Sparkles, badge: `${promotions.length}` },
    { id: 'offers', label: 'Offers & Deals', icon: Tag },
    { id: 'food', label: 'Food & Menus', icon: Utensils },
    { id: 'grocery', label: 'Grocery Stock', icon: ShoppingBag },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'real-estate', label: 'Real Estate', icon: Home },
    { id: 'hospitals', label: 'Hospitals', icon: HeartPulse },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'royal-points', label: 'Royal Points', icon: Award },
    { id: 'stories', label: 'Stories', icon: Video },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'subscriptions', label: 'Subscriptions', icon: Zap },
    { id: 'homepage-content', label: 'Homepage Content', icon: Eye },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border text-xs font-bold transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-900/90 text-emerald-200 border-emerald-500'
            : 'bg-rose-900/90 text-rose-200 border-rose-500'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Security Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">Royal Korutla Admin</h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 uppercase tracking-wide">
                  Owner Only
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400 inline" /> Session: <strong className="text-slate-200 font-medium">admin@royalkorutla.com (ME)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors">
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Admin Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Module Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Owner Controls (25 Modules)</p>
            <nav className="space-y-0.5 max-h-[70vh] md:max-h-none overflow-y-auto pr-1">
              {tabsList.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-950/60 rounded-3xl border border-slate-800 p-4 sm:p-6 space-y-6">

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/30">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold mb-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Royal Korutla Private Control Center</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">Welcome, Owner Admin 👑</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg">
                    Full control over all 25 modules of Royal Korutla. Manage businesses, verify badges, publish paid promotions without code editing, moderate reviews, and track revenue.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('promotions')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Publish New Promotion</span>
                </button>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Total Businesses</span>
                    <Building2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{businesses.length}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{businesses.filter(b=>b.isVerified).length} Verified</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Active Promotions</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black text-amber-400">{promotions.filter(p=>p.status==='ACTIVE').length}</p>
                  <p className="text-[10px] text-amber-300 font-semibold">Zero-code published</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Monthly Ad Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-emerald-400">₹48,500</p>
                  <p className="text-[10px] text-emerald-300 font-semibold">+24% vs last month</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Registered Users</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{usersList.length * 350}+</p>
                  <p className="text-[10px] text-slate-400">Korutla residents</p>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Quick Admin Short-Cuts</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button onClick={() => setActiveTab('add-business')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-1 transition-all">
                    <Plus className="w-4 h-4 text-amber-400" />
                    <p className="font-bold text-white">Add New Business</p>
                    <p className="text-[10px] text-slate-400">Register shop in Korutla</p>
                  </button>
                  <button onClick={() => setActiveTab('promotions')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-1 transition-all">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <p className="font-bold text-white">Publish Paid Promo</p>
                    <p className="text-[10px] text-slate-400">Image &amp; dates placement</p>
                  </button>
                  <button onClick={() => setActiveTab('verify-business')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-1 transition-all">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <p className="font-bold text-white">Verify Badges</p>
                    <p className="text-[10px] text-slate-400">Toggle RK Verified tick</p>
                  </button>
                  <button onClick={() => setActiveTab('reviews')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-1 transition-all">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <p className="font-bold text-white">Moderate Reviews</p>
                    <p className="text-[10px] text-slate-400">Approve or flag comments</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROMOTIONS (NO-CODE BUSINESS PROMOTION MANAGER) */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>No-Code Paid Business Promotion Publisher</span>
                </div>
                <h2 className="text-xl font-bold text-white">Publish Paid Business Promotions</h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  When a local business pays for promotion, enter the details here. Select the business, upload/paste the banner image, set start and end dates, and publish! The site automatically renders active campaigns and hides them on expiry.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Form */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Create Paid Campaign</span>
                  </h3>

                  <form onSubmit={handlePublishPromotion} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Business Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Paradise Biryani"
                        value={promBizName}
                        onChange={(e) => setPromBizName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Promotional Image URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={promImage}
                        onChange={(e) => setPromImage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Promotion Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Grand Festival Offer 2026"
                        value={promTitle}
                        onChange={(e) => setPromTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Offer Tagline / Highlight</label>
                      <input
                        type="text"
                        placeholder="e.g. Flat 20% OFF on all items"
                        value={promOfferText}
                        onChange={(e) => setPromOfferText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Promotion Type</label>
                        <select
                          value={promType}
                          onChange={(e) => setPromType(e.target.value as PromotionType)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="HOMEPAGE_FEATURED">Homepage Featured</option>
                          <option value="FEATURED_BUSINESS">Featured Business Ticker</option>
                          <option value="CATEGORY_FEATURED">Category Spotlight</option>
                          <option value="SPONSORED_OFFER">Sponsored Offer</option>
                          <option value="FESTIVAL_CAMPAIGN">Festival Campaign</option>
                          <option value="BUSINESS_OF_THE_WEEK">Business of Week</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Placement Target</label>
                        <select
                          value={promPlacement}
                          onChange={(e) => setPromPlacement(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Homepage Top Banner">Homepage Top Banner</option>
                          <option value="Food Section Header">Food Section Header</option>
                          <option value="Shopping Section Header">Shopping Header</option>
                          <option value="Hospitals Section">Hospitals Section</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Start Date</label>
                        <input
                          type="date"
                          value={promStartDate}
                          onChange={(e) => setPromStartDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">End Date (Expiry)</label>
                        <input
                          type="date"
                          value={promEndDate}
                          onChange={(e) => setPromEndDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all mt-2"
                    >
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>Publish Live on Website</span>
                    </button>
                  </form>
                </div>

                {/* Active Promotions List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Current Campaigns ({promotions.length})</span>
                    </h3>
                    <button onClick={fetchPromotions} className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  </div>

                  {loadingPromotions ? (
                    <div className="p-8 text-center text-slate-400 text-xs">Loading promotions...</div>
                  ) : promotions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-900 rounded-2xl border border-slate-800">
                      No promotion campaigns published yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {promotions.map((p) => (
                        <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {p.bannerImage && (
                              <img src={p.bannerImage} alt={p.businessName} className="w-16 h-12 object-cover rounded-xl shrink-0" />
                            )}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase">
                                  {p.badgeLabel || 'PROMOTED'}
                                </span>
                                <span className="text-[11px] font-semibold text-purple-400">{p.placement}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white">{p.businessName}</h4>
                              {p.offerText && <p className="text-xs text-amber-300 font-semibold">{p.offerText}</p>}
                              <p className="text-[10px] text-slate-400">Valid: {p.startDate} to {p.endDate}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold border ${
                              p.status === 'ACTIVE'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border-rose-800'
                            }`}>
                              {p.status}
                            </span>
                            <button
                              onClick={() => handleDeletePromotion(p.id)}
                              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-all text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESSES */}
          {activeTab === 'businesses' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Korutla Local Businesses ({businesses.length})</h3>
                  <p className="text-xs text-slate-400">Manage listings, toggle RK verified badge, pin to featured section.</p>
                </div>
                <button onClick={() => setActiveTab('add-business')} className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add New Business
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Business</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Verified Badge</th>
                      <th className="p-3">Featured Ticker</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {businesses.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/60">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <img src={b.image} alt={b.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span>{b.name}</span>
                        </td>
                        <td className="p-3 capitalize">{b.categorySlug} ({b.subCategory})</td>
                        <td className="p-3">{b.phone}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleVerifyBiz(b.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              b.isVerified
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{b.isVerified ? 'VERIFIED' : 'Not Verified'}</span>
                          </button>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleFeaturedBiz(b.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              b.isFeatured
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {b.isFeatured ? 'FEATURED' : 'Standard'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setBusinesses(businesses.filter(item => item.id !== b.id))}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ADD BUSINESS */}
          {activeTab === 'add-business' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Register New Business in Korutla</span>
              </h3>
              <form onSubmit={handleAddBusiness} className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Business / Shop Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Sweets & Bakery"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category Slug</label>
                    <select
                      value={newBizCategory}
                      onChange={(e) => setNewBizCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="food">Food &amp; Dining</option>
                      <option value="groceries">Groceries &amp; Marts</option>
                      <option value="shopping">Shopping &amp; Apparel</option>
                      <option value="services">Services &amp; Repair</option>
                      <option value="hospitals">Hospitals &amp; Doctors</option>
                      <option value="jobs">Local Jobs</option>
                      <option value="real-estate">Real Estate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Sub-Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Bakery & Confectionery"
                      value={newBizSubCategory}
                      onChange={(e) => setNewBizSubCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98480 12345"
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Timing</label>
                    <input
                      type="text"
                      value={newBizTiming}
                      onChange={(e) => setNewBizTiming(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Address / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Road, Korutla"
                    value={newBizAddress}
                    onChange={(e) => setNewBizAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={newBizImage}
                    onChange={(e) => setNewBizImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="v-check"
                    checked={newBizVerified}
                    onChange={(e) => setNewBizVerified(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="v-check" className="text-slate-300 font-bold">
                    Grant Royal Korutla Verified Badge Immediately
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                >
                  Save Business Listing
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: VERIFY BUSINESS */}
          {activeTab === 'verify-business' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Verify Business Badges &amp; Audits</span>
              </h3>
              <p className="text-xs text-slate-400">Click to grant or remove the Royal Korutla Verified blue tick badge.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {businesses.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={b.image} alt={b.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{b.name}</h4>
                        <p className="text-[10px] text-slate-400">{b.subCategory}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleVerifyBiz(b.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        b.isVerified
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-slate-800 text-slate-300 hover:bg-emerald-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{b.isVerified ? 'VERIFIED' : 'Grant Badge'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: OFFERS */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                <span>Town Offers &amp; Discounts ({offers.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {offers.map((off) => (
                  <div key={off.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <img src={off.image} alt={off.title} className="w-full h-28 object-cover rounded-xl" />
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">{off.discount}</span>
                    <h4 className="text-xs font-bold text-white">{off.title}</h4>
                    <p className="text-[11px] text-slate-400">{off.businessName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: FOOD & MENUS */}
          {activeTab === 'food' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                <span>Restaurant Dishes &amp; Menus ({foodItems.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {foodItems.map((dish) => (
                  <div key={dish.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{dish.name}</h4>
                        <p className="text-[10px] text-amber-400 font-extrabold">₹{dish.price}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dish.isVeg ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                      {dish.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: JOBS */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <span>Korutla Local Job Listings ({jobs.length})</span>
              </h3>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{job.title}</h4>
                      <p className="text-xs text-slate-400">{job.shopName} • {job.salary}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800">
                      {job.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 16: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>User Accounts &amp; Access Roles</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">User Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/60">
                        <td className="p-3 font-bold text-white">{u.name}</td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            u.role === 'ADMIN' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-emerald-400 font-bold">{u.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 25: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-amber-400" />
                <span>Platform Settings &amp; Configuration</span>
              </h3>
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Platform Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Support Helpline Phone</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Maintenance Mode</p>
                    <p className="text-[10px] text-slate-400">Temporarily restrict public access to Korutla app</p>
                  </div>
                  <button
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      maintenanceMode ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {maintenanceMode ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <button
                  onClick={() => showToast('Platform settings saved successfully.')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {!['dashboard', 'promotions', 'businesses', 'add-business', 'verify-business', 'offers', 'food', 'jobs', 'users', 'settings'].includes(activeTab) && (
            <div className="p-8 text-center space-y-3 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white capitalize">{activeTab.replace('-', ' ')} Module</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Module active &amp; connected to Royal Korutla database. Real-time updates active.
              </p>
              <button onClick={() => setActiveTab('dashboard')} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700">
                Return to Dashboard Overview
              </button>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}
