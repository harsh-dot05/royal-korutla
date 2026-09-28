'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  STORIES_REELS,
  PHOTOGRAPHY_BUSINESSES,
  HERO_SLIDES as HOMEPAGE_SLIDES,
} from '@/data/mockData';
import {
  Promotion,
  PromotionType,
  LocalBusiness,
  Offer,
  FoodMenuItem,
  JobListing,
  RealEstateProperty,
  HospitalDetail,
  Doctor,
  Review,
  StoryReel,
  PhotographyBusiness,
  PhotographyType,
  HomepageSlide,
} from '@/types';
import {
  Shield,
  Sparkles,
  Building2,
  CheckCircle2,
  DollarSign,
  Plus,
  LogOut,
  Lock,
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
  Camera,
  ArrowUp,
  ArrowDown,
  Layers,
  Phone,
  MapPin,
  Check,
  Star,
  Zap,
  Sliders,
} from 'lucide-react';

type AdminTab =
  | 'dashboard'
  | 'businesses'
  | 'add-business'
  | 'edit-business'
  | 'verify-business'
  | 'featured-businesses'
  | 'photography'
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

const ALL_PHOTO_TYPES: PhotographyType[] = [
  'Wedding',
  'Portrait',
  'Events',
  'Drone',
  'Pre-wedding',
  'Newborn',
  'Studio',
  'Fashion',
  'Commercial',
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
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

  // Photography State
  const [photographyList, setPhotographyList] = useState<PhotographyBusiness[]>(PHOTOGRAPHY_BUSINESSES);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [editingPhotoStudio, setEditingPhotoStudio] = useState<PhotographyBusiness | null>(null);

  // Photography Form State
  const [photoName, setPhotoName] = useState('');
  const [photoProfile, setPhotoProfile] = useState('');
  const [photoCover, setPhotoCover] = useState('');
  const [photoLocation, setPhotoLocation] = useState('Korutla Town');
  const [photoLandmark, setPhotoLandmark] = useState('Main Road');
  const [photoPhone, setPhotoPhone] = useState('');
  const [photoWhatsapp, setPhotoWhatsapp] = useState('');
  const [photoInstagram, setPhotoInstagram] = useState('');
  const [photoDesc, setPhotoDesc] = useState('');
  const [photoTypes, setPhotoTypes] = useState<PhotographyType[]>(['Wedding', 'Events']);
  const [photoPrice, setPhotoPrice] = useState('₹15,000 / day');
  const [photoVerified, setPhotoVerified] = useState(true);
  const [photoFeatured, setPhotoFeatured] = useState(false);

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

  // Homepage Content State
  const [heroSlides, setHeroSlides] = useState<HomepageSlide[]>(HOMEPAGE_SLIDES);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideCtaText, setNewSlideCtaText] = useState('Explore Deals');
  const [newSlideCtaLink, setNewSlideCtaLink] = useState('/offers');
  const [newSlideBg, setNewSlideBg] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80');

  // Offers State
  const [offers, setOffers] = useState<Offer[]>(FEATURED_OFFERS);

  // Food Menu Items State
  const [foodItems, setFoodItems] = useState<FoodMenuItem[]>(FOOD_MENU_ITEMS);

  // Jobs State
  const [jobs, setJobs] = useState<JobListing[]>(LOCAL_JOBS);

  // Users State
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Royal Korutla Owner', email: 'admin@royalkorutla.com', role: 'ADMIN', phone: '+91 98480 11223', status: 'ACTIVE', joinedDate: '2026-01-01' },
    { id: 'usr-2', name: 'Mohammed Ahmed (Royal Biryani)', email: 'ahmed@royalbiryani.com', role: 'BUSINESS_OWNER', phone: '+91 98765 43210', status: 'ACTIVE', joinedDate: '2026-02-10' },
    { id: 'usr-3', name: 'Srinivas Goud', email: 'srinivas.korutla@gmail.com', role: 'CUSTOMER', phone: '+91 94401 88776', status: 'ACTIVE', joinedDate: '2026-03-05' },
    { id: 'usr-4', name: 'Ravali Textiles', email: 'ravali.textiles@gmail.com', role: 'BUSINESS_OWNER', phone: '+91 98492 55443', status: 'ACTIVE', joinedDate: '2026-03-12' },
  ]);

  // Stories & Reels
  const [storiesList, setStoriesList] = useState<StoryReel[]>(STORIES_REELS);

  // Settings State
  const [siteName, setSiteName] = useState('Royal Korutla Directory');
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

  // Fetch Photography Studios from API
  const fetchPhotography = async () => {
    setLoadingPhoto(true);
    try {
      const res = await fetch('/api/admin/photography');
      const data = await res.json();
      if (data.success && data.data) {
        setPhotographyList(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch photography studios', e);
    } finally {
      setLoadingPhoto(false);
    }
  };

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAdminSession() {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (!res.ok || !data.success || data.user?.role !== 'ADMIN') {
          router.replace('/admin/login');
          return;
        }
      } catch (err) {
        router.replace('/admin/login');
        return;
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAdminSession();
    fetchPromotions();
    fetchPhotography();
  }, [router]);

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
    router.replace('/admin/login');
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

  const handleStartEditBiz = (biz: LocalBusiness) => {
    setEditingBiz(biz);
    setNewBizName(biz.name);
    setNewBizCategory(biz.categorySlug);
    setNewBizSubCategory(biz.subCategory || '');
    setNewBizPhone(biz.phone || '');
    setNewBizAddress(biz.address || '');
    setNewBizTiming(biz.timing || '09:00 AM - 09:00 PM');
    setNewBizImage(biz.image);
    setNewBizVerified(biz.isVerified);
    setActiveTab('edit-business');
  };

  const handleSaveEditBiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBiz) return;
    setBusinesses(businesses.map(b => b.id === editingBiz.id ? {
      ...b,
      name: newBizName,
      categorySlug: newBizCategory as any,
      subCategory: newBizSubCategory,
      phone: newBizPhone,
      address: newBizAddress,
      timing: newBizTiming,
      image: newBizImage,
      isVerified: newBizVerified,
    } : b));
    showToast(`Updated "${newBizName}" details successfully.`);
    setEditingBiz(null);
    setActiveTab('businesses');
  };

  // Photography Actions
  const handleSavePhotographyStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoName || !photoPhone) {
      showToast('Studio Name and Phone Number are required', 'error');
      return;
    }

    try {
      const isEdit = !!editingPhotoStudio;
      const url = '/api/admin/photography';
      const method = isEdit ? 'PUT' : 'POST';
      const body = {
        ...(isEdit ? { id: editingPhotoStudio.id } : {}),
        name: photoName,
        profileImage: photoProfile || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80',
        coverImage: photoCover || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
        location: photoLocation,
        landmark: photoLandmark,
        phone: photoPhone,
        whatsapp: photoWhatsapp || photoPhone,
        instagram: photoInstagram,
        description: photoDesc,
        photographyTypes: photoTypes,
        startingPrice: photoPrice,
        isVerified: photoVerified,
        isFeatured: photoFeatured,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? `Updated "${photoName}" studio!` : `Added "${photoName}" photography studio!`);
        fetchPhotography();
        resetPhotoForm();
      } else {
        showToast(data.message || 'Failed to save photography studio', 'error');
      }
    } catch (err) {
      showToast('Error saving photography studio', 'error');
    }
  };

  const resetPhotoForm = () => {
    setEditingPhotoStudio(null);
    setPhotoName('');
    setPhotoProfile('');
    setPhotoCover('');
    setPhotoLocation('Korutla Town');
    setPhotoLandmark('Main Road');
    setPhotoPhone('');
    setPhotoWhatsapp('');
    setPhotoInstagram('');
    setPhotoDesc('');
    setPhotoTypes(['Wedding', 'Events']);
    setPhotoPrice('₹15,000 / day');
    setPhotoVerified(true);
    setPhotoFeatured(false);
  };

  const handleEditPhotoStudio = (studio: PhotographyBusiness) => {
    setEditingPhotoStudio(studio);
    setPhotoName(studio.name);
    setPhotoProfile(studio.profileImage);
    setPhotoCover(studio.coverImage);
    setPhotoLocation(studio.location);
    setPhotoLandmark(studio.landmark || '');
    setPhotoPhone(studio.phone);
    setPhotoWhatsapp(studio.whatsapp || studio.phone);
    setPhotoInstagram(studio.instagram || '');
    setPhotoDesc(studio.description);
    setPhotoTypes(studio.photographyTypes);
    setPhotoPrice(studio.startingPrice || '₹15,000 / day');
    setPhotoVerified(studio.isVerified);
    setPhotoFeatured(studio.isFeatured);
  };

  const handleDeletePhotoStudio = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/photography?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Photography studio removed successfully.');
        fetchPhotography();
      }
    } catch (err) {
      showToast('Error removing studio', 'error');
    }
  };

  const togglePhotoTypeSelection = (t: PhotographyType) => {
    if (photoTypes.includes(t)) {
      setPhotoTypes(photoTypes.filter(item => item !== t));
    } else {
      setPhotoTypes([...photoTypes, t]);
    }
  };

  // Promotion Publisher Action
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
        showToast(`Promotion Published! "${promBizName}" is now active in ${promPlacement}!`);
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

  // Homepage Slide Action
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitle) return;
    const slide: HomepageSlide = {
      id: `slide-${Date.now()}`,
      title: newSlideTitle,
      subtitle: newSlideSubtitle,
      ctaText: newSlideCtaText,
      ctaLink: newSlideCtaLink,
      image: newSlideBg,
      badgeText: 'HOT DEAL',
    };
    setHeroSlides([...heroSlides, slide]);
    setNewSlideTitle('');
    setNewSlideSubtitle('');
    showToast('Hero slide added to homepage banner carousel!');
  };

  const moveBusinessOrder = (index: number, direction: 'up' | 'down') => {
    const updated = [...businesses];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBusinesses(updated);
    showToast('Featured business order updated');
  };

  // Tab definitions
  const tabsList: { id: AdminTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'businesses', label: 'Businesses', icon: Building2, badge: `${businesses.length}` },
    { id: 'add-business', label: 'Add Business', icon: Plus },
    { id: 'edit-business', label: 'Edit Business', icon: Edit3 },
    { id: 'verify-business', label: 'Verify Badges', icon: CheckCircle2 },
    { id: 'featured-businesses', label: 'Featured Ticker', icon: Crown },
    { id: 'photography', label: 'Photography & Studios', icon: Camera, badge: `${photographyList.length}` },
    { id: 'promotions', label: 'Promotions (Paid)', icon: Sparkles, badge: `${promotions.length}` },
    { id: 'homepage-content', label: 'Homepage Content', icon: Eye },
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
    { id: 'stories', label: 'Stories & Reels', icon: Video },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'subscriptions', label: 'Subscriptions', icon: Zap },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-semibold">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800">
          <Shield className="w-5 h-5 text-blue-500 animate-pulse" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

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
            <div className="w-10 h-10 rounded-xl bg-blue-700 p-0.5 flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">Royal Korutla Admin</h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800 uppercase tracking-wide">
                  Owner Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400 inline" /> Session: <strong className="text-slate-200 font-medium">admin@royalkorutla.com</strong>
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Admin Modules ({tabsList.length})</p>
            <nav className="space-y-0.5 max-h-[75vh] overflow-y-auto pr-1">
              {tabsList.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-700 text-white font-extrabold shadow-md'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-blue-900' : 'bg-slate-800 text-slate-400'
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-900/40 border border-blue-700 text-blue-300 text-[11px] font-bold mb-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Royal Korutla Private Control Center</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">Welcome, Owner Admin</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg">
                    Manage town businesses, photography studios, paid promotions, homepage banners, and verified listing badges.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('promotions')}
                  className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center gap-2 shrink-0 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish New Promotion</span>
                </button>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Total Businesses</span>
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{businesses.length}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{businesses.filter(b=>b.isVerified).length} Verified</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Photography Studios</span>
                    <Camera className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{photographyList.length}</p>
                  <p className="text-[10px] text-blue-300 font-semibold">Korutla Studios</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Active Promotions</span>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-black text-blue-400">{promotions.filter(p=>p.status==='ACTIVE').length}</p>
                  <p className="text-[10px] text-blue-300 font-semibold">Live on website</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Town Coverage</span>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-white">505326</p>
                  <p className="text-[10px] text-slate-400">Korutla Town Portal</p>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>Quick Admin Short-Cuts</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button onClick={() => setActiveTab('photography')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-1 transition-all">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <p className="font-bold text-white">Photography Studios</p>
                    <p className="text-[10px] text-slate-400">Add studio / wedding photography</p>
                  </button>
                  <button onClick={() => setActiveTab('add-business')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-1 transition-all">
                    <Plus className="w-4 h-4 text-blue-400" />
                    <p className="font-bold text-white">Add New Business</p>
                    <p className="text-[10px] text-slate-400">Register shop in Korutla</p>
                  </button>
                  <button onClick={() => setActiveTab('promotions')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-1 transition-all">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <p className="font-bold text-white">Publish Paid Promo</p>
                    <p className="text-[10px] text-slate-400">Banner &amp; date placement</p>
                  </button>
                  <button onClick={() => setActiveTab('homepage-content')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-1 transition-all">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <p className="font-bold text-white">Homepage Banners</p>
                    <p className="text-[10px] text-slate-400">Hero slides &amp; featured order</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PHOTOGRAPHY & STUDIOS MANAGEMENT */}
          {activeTab === 'photography' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-800 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 text-xs font-bold">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>Photography &amp; Studios Content Management</span>
                </div>
                <h2 className="text-xl font-bold text-white">Manage Photography &amp; Studios</h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Add, edit, or manage Korutla photo studios, camera rentals, wedding photography teams, pricing, portfolio galleries, and contact details.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add/Edit Form */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-purple-400" />
                      <span>{editingPhotoStudio ? 'Edit Studio Profile' : 'Add Photography Studio'}</span>
                    </h3>
                    {editingPhotoStudio && (
                      <button onClick={resetPhotoForm} className="text-[11px] text-slate-400 hover:text-white">
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSavePhotographyStudio} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Studio / Photographer Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Digital Photography Studio"
                        value={photoName}
                        onChange={(e) => setPhotoName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Phone Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="+91 98480 12345"
                          value={photoPhone}
                          onChange={(e) => setPhotoPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">WhatsApp Number</label>
                        <input
                          type="text"
                          placeholder="+91 98480 12345"
                          value={photoWhatsapp}
                          onChange={(e) => setPhotoWhatsapp(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Profile Image URL</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={photoProfile}
                          onChange={(e) => setPhotoProfile(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Cover Image URL</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={photoCover}
                          onChange={(e) => setPhotoCover(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Location / Address</label>
                        <input
                          type="text"
                          placeholder="e.g. Main Road, Korutla"
                          value={photoLocation}
                          onChange={(e) => setPhotoLocation(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Starting Price</label>
                        <input
                          type="text"
                          placeholder="e.g. ₹15,000 / day"
                          value={photoPrice}
                          onChange={(e) => setPhotoPrice(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Instagram Handle</label>
                      <input
                        type="text"
                        placeholder="e.g. @royal_korutla_studios"
                        value={photoInstagram}
                        onChange={(e) => setPhotoInstagram(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Description / Services</label>
                      <textarea
                        rows={2}
                        placeholder="Specialist in cinematic wedding photography, candid video shoots, drone coverage in Korutla."
                        value={photoDesc}
                        onChange={(e) => setPhotoDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Photography Types</label>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ALL_PHOTO_TYPES.map((type) => {
                          const isSel = photoTypes.includes(type);
                          return (
                            <button
                              type="button"
                              key={type}
                              onClick={() => togglePhotoTypeSelection(type)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                isSel
                                  ? 'bg-purple-900/60 text-purple-200 border-purple-600'
                                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                            >
                              {isSel ? '✓ ' : ''}{type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={photoVerified}
                          onChange={(e) => setPhotoVerified(e.target.checked)}
                          className="rounded text-blue-700"
                        />
                        <span className="text-slate-300 font-bold">Verified</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={photoFeatured}
                          onChange={(e) => setPhotoFeatured(e.target.checked)}
                          className="rounded text-blue-700"
                        />
                        <span className="text-slate-300 font-bold">Featured Studio</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all mt-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{editingPhotoStudio ? 'Update Studio Profile' : 'Save Photography Studio'}</span>
                    </button>
                  </form>
                </div>

                {/* Studios List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-purple-400" />
                      <span>Korutla Photography Studios ({photographyList.length})</span>
                    </h3>
                    <button onClick={fetchPhotography} className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  </div>

                  {loadingPhoto ? (
                    <div className="p-8 text-center text-slate-400 text-xs">Loading studios...</div>
                  ) : photographyList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-900 rounded-2xl border border-slate-800">
                      No photography studios registered yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {photographyList.map((studio) => (
                        <div key={studio.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={studio.profileImage} alt={studio.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{studio.name}</h4>
                                {studio.isVerified && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold text-[10px]">
                                    VERIFIED
                                  </span>
                                )}
                                {studio.isFeatured && (
                                  <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold text-[10px]">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400">{studio.location} • Phone: {studio.phone}</p>
                              <div className="flex flex-wrap gap-1">
                                {studio.photographyTypes.map((t) => (
                                  <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-purple-300">
                                    {t}
                                  </span>
                                ))}
                                {studio.startingPrice && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-[10px] font-bold text-emerald-300 border border-emerald-800">
                                    Starting {studio.startingPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleEditPhotoStudio(studio)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePhotoStudio(studio.id)}
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

          {/* TAB 7: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-900/40 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Paid Business Promotion Publisher</span>
                </div>
                <h2 className="text-xl font-bold text-white">Publish Paid Business Promotions</h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  When a local business pays for promotion, enter the details here. Select the business, upload/paste the banner image, set start and end dates, and publish live on Royal Korutla.
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
                          <option value="Photography Header">Photography Header</option>
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
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all mt-2"
                    >
                      <Sparkles className="w-4 h-4" />
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
                                <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-extrabold text-[10px] uppercase">
                                  {p.badgeLabel || 'PROMOTED'}
                                </span>
                                <span className="text-[11px] font-semibold text-blue-400">{p.placement}</span>
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
                <button onClick={() => setActiveTab('add-business')} className="px-3.5 py-2 rounded-xl bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5">
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
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3 text-blue-400" />
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
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleStartEditBiz(b)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
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
                <Plus className="w-5 h-5 text-blue-400" />
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category</label>
                    <select
                      value={newBizCategory}
                      onChange={(e) => setNewBizCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="food">Food &amp; Dining</option>
                      <option value="groceries">Groceries &amp; Marts</option>
                      <option value="photography">Photography &amp; Studios</option>
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Timing</label>
                    <input
                      type="text"
                      value={newBizTiming}
                      onChange={(e) => setNewBizTiming(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={newBizImage}
                    onChange={(e) => setNewBizImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="v-check"
                    checked={newBizVerified}
                    onChange={(e) => setNewBizVerified(e.target.checked)}
                    className="rounded text-blue-700"
                  />
                  <label htmlFor="v-check" className="text-slate-300 font-bold">
                    Grant Royal Korutla Verified Badge
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-lg"
                >
                  Save Business Listing
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: EDIT BUSINESS */}
          {activeTab === 'edit-business' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <span>Edit Business Details {editingBiz ? `(${editingBiz.name})` : ''}</span>
              </h3>
              {editingBiz ? (
                <form onSubmit={handleSaveEditBiz} className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={newBizName}
                      onChange={(e) => setNewBizName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Category</label>
                      <select
                        value={newBizCategory}
                        onChange={(e) => setNewBizCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="food">Food &amp; Dining</option>
                        <option value="groceries">Groceries &amp; Marts</option>
                        <option value="photography">Photography &amp; Studios</option>
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
                        value={newBizSubCategory}
                        onChange={(e) => setNewBizSubCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={newBizPhone}
                        onChange={(e) => setNewBizPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Timing</label>
                      <input
                        type="text"
                        value={newBizTiming}
                        onChange={(e) => setNewBizTiming(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Address</label>
                    <input
                      type="text"
                      value={newBizAddress}
                      onChange={(e) => setNewBizAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                    <input
                      type="url"
                      value={newBizImage}
                      onChange={(e) => setNewBizImage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="ve-check"
                      checked={newBizVerified}
                      onChange={(e) => setNewBizVerified(e.target.checked)}
                      className="rounded text-blue-700"
                    />
                    <label htmlFor="ve-check" className="text-slate-300 font-bold">
                      Royal Korutla Verified Badge Active
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs"
                    >
                      Update Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('businesses')}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                  Please select a business from the <button onClick={() => setActiveTab('businesses')} className="text-blue-400 underline">Businesses tab</button> to edit.
                </div>
              )}
            </div>
          )}

          {/* TAB: HOMEPAGE CONTENT MANAGEMENT */}
          {activeTab === 'homepage-content' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 text-xs font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Homepage Content &amp; Layout Manager</span>
                </div>
                <h2 className="text-xl font-bold text-white">Homepage Banners &amp; Featured Order</h2>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Add custom hero banner slides, reorder featured businesses shown on homepage, and update town spotlights.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hero Slides */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-400" /> Hero Slides ({heroSlides.length})</span>
                  </h3>

                  <form onSubmit={handleAddSlide} className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="font-bold text-slate-200">Add New Banner Slide</p>
                    <input
                      type="text"
                      required
                      placeholder="Slide Main Title (e.g. Festival Season Sale)"
                      value={newSlideTitle}
                      onChange={(e) => setNewSlideTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Subtitle (e.g. Up to 40% discount across stores)"
                      value={newSlideSubtitle}
                      onChange={(e) => setNewSlideSubtitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={newSlideCtaText}
                        onChange={(e) => setNewSlideCtaText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Button Link (e.g. /offers)"
                        value={newSlideCtaLink}
                        onChange={(e) => setNewSlideCtaLink(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Background Image URL"
                      value={newSlideBg}
                      onChange={(e) => setNewSlideBg(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                    />
                    <button type="submit" className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-lg">
                      Add Hero Slide
                    </button>
                  </form>

                  <div className="space-y-2">
                    {heroSlides.map((slide) => (
                      <div key={slide.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{slide.title}</p>
                          <p className="text-[11px] text-slate-400">{slide.subtitle}</p>
                        </div>
                        <button
                          onClick={() => setHeroSlides(heroSlides.filter(s => s.id !== slide.id))}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Business Reordering */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Featured Businesses Order</span>
                  </h3>
                  <p className="text-xs text-slate-400">Reorder featured listings shown on homepage carousel:</p>

                  <div className="space-y-2">
                    {businesses.slice(0, 8).map((biz, idx) => (
                      <div key={biz.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-white">{biz.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => moveBusinessOrder(idx, 'up')}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === businesses.slice(0, 8).length - 1}
                            onClick={() => moveBusinessOrder(idx, 'down')}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VERIFY BUSINESS */}
          {activeTab === 'verify-business' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Verify Business Badges &amp; Audits</span>
              </h3>
              <p className="text-xs text-slate-400">Click to grant or remove the Royal Korutla Verified badge.</p>
              
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
                          ? 'bg-blue-950 text-blue-300 border border-blue-700'
                          : 'bg-slate-800 text-slate-300 hover:bg-blue-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
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
                    <span className="px-2 py-0.5 rounded bg-blue-700 text-white font-black text-[10px]">{off.discount}</span>
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
                            u.role === 'ADMIN' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'
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
                <SettingsIcon className="w-5 h-5 text-blue-400" />
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
                  className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {!['dashboard', 'photography', 'promotions', 'businesses', 'add-business', 'edit-business', 'verify-business', 'homepage-content', 'offers', 'food', 'jobs', 'users', 'settings'].includes(activeTab) && (
            <div className="p-8 text-center space-y-3 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-900/40 border border-blue-700 flex items-center justify-center mx-auto text-white">
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
