'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShoppingBag, Plus, Minus, Search, MessageSquare, Check, MapPin, Store } from 'lucide-react';

interface GroceryProduct {
  id: string;
  name: string;
  category: string;
  weight: string;
  price: number;
  image: string;
}

const GROCERY_PRODUCTS: GroceryProduct[] = [
  { id: 'gp-1', name: 'Fresh Organic Tomatoes', category: 'Vegetables', weight: '1 kg', price: 40, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' },
  { id: 'gp-2', name: 'Fresh Farm Potatoes', category: 'Vegetables', weight: '1 kg', price: 35, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80' },
  { id: 'gp-3', name: 'Pure Cow Milk Pouch', category: 'Dairy', weight: '500 ml', price: 32, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80' },
  { id: 'gp-4', name: 'Sona Masoori Rice Bag', category: 'Atta & Rice', weight: '10 kg', price: 580, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80' },
  { id: 'gp-5', name: 'Freedom Refined Sunflower Oil', category: 'Oils & Ghee', weight: '1 L', price: 145, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80' },
  { id: 'gp-6', name: 'Organic Toor Dal (Kandi Pappu)', category: 'Pulses', weight: '1 kg', price: 160, image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80' },
];

export default function GroceriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');

  const categories = ['All', 'Vegetables', 'Dairy', 'Atta & Rice', 'Oils & Ghee', 'Pulses'];

  const filteredProducts = GROCERY_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const p = GROCERY_PRODUCTS.find((item) => item.id === id);
    return acc + (p ? p.price * qty : 0);
  }, 0);

  const handleOrderWhatsApp = () => {
    if (!customerName || !customerPhone || !address) {
      alert('Please enter your Name, Phone Number, and Address to complete order!');
      return;
    }

    let msg = `*NEW GROCERY ORDER - ROYAL KORUTLA* 🛒\n`;
    msg += `Store: Green Fresh Organic Supermart\n\n`;
    msg += `*Customer Details:*\n`;
    msg += `Name: ${customerName}\n`;
    msg += `Phone: ${customerPhone}\n`;
    msg += `Address: ${address}\n\n`;
    msg += `*Order Items:*\n`;

    Object.entries(cart).forEach(([id, qty], idx) => {
      const p = GROCERY_PRODUCTS.find((item) => item.id === id);
      if (p) {
        msg += `${idx + 1}. ${p.name} (${p.weight}) x ${qty} = ₹${p.price * qty}\n`;
      }
    });

    msg += `\n*Total Estimated Bill:* ₹${subtotal}\n`;
    msg += `*Delivery:* Free Doorstep Delivery in Korutla\n`;

    window.open(`https://wa.me/919989077665?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="rounded-3xl pastel-card p-6 sm:p-8 border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-white shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold mb-3">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>Korutla Supermart &amp; Grocery Delivery</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Fresh Groceries Delivered in <span className="text-emerald-600">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Order vegetables, rice, dal, milk, and cooking oil directly from local Korutla marts on WhatsApp.
              </p>
            </div>

            {totalItems > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-emerald-300 text-center w-full md:w-auto shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">{totalItems} Items Selected</p>
                <p className="text-xl font-black text-emerald-600">₹{subtotal}</p>
              </div>
            )}
          </div>
        </div>

        {/* Search & Category filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 'Tomatoes', 'Milk', 'Rice'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid & Cart Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredProducts.map((prod) => {
              const qty = cart[prod.id] || 0;

              return (
                <div
                  key={prod.id}
                  className="pastel-card pastel-card-hover rounded-2xl p-4 flex gap-4 border border-slate-100 bg-white shadow-sm"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image src={prod.image} alt={prod.name} fill sizes="96px" className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{prod.category}</span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{prod.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{prod.weight}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-black text-slate-900">₹{prod.price}</span>

                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
                          <button onClick={() => updateQty(prod.id, -1)} className="text-slate-700 hover:text-emerald-700">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-emerald-700">{qty}</span>
                          <button onClick={() => updateQty(prod.id, 1)} className="text-slate-700 hover:text-emerald-700">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateQty(prod.id, 1)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 transition-all shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grocery Cart Drawer / Checkout Form */}
          <div className="pastel-card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm h-fit space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Grocery Order Checkout</span>
            </h2>

            {totalItems === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No items selected yet. Click + ADD on products!</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(cart).map(([id, qty]) => {
                    const p = GROCERY_PRODUCTS.find((item) => item.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                        <span className="text-slate-700 font-semibold truncate max-w-[160px]">{p.name} x {qty}</span>
                        <span className="text-emerald-700 font-bold">₹{p.price * qty}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-700">₹{subtotal}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <textarea
                    placeholder="Korutla Delivery Address *"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handleOrderWhatsApp}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Send Order to WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
