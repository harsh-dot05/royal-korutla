'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES, FOOD_MENU_ITEMS } from '@/data/mockData';
import { FoodMenuItem, CartItem } from '@/types';
import { Utensils, ShoppingBag, Plus, Minus, Star, MapPin, Clock, MessageSquare, Check, X } from 'lucide-react';

export default function FoodPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');

  const restaurant = FEATURED_BUSINESSES.find((b) => b.categorySlug === 'food') || FEATURED_BUSINESSES[0];
  const categories = ['All', 'Biryani Specials', 'North Indian', 'Starters', 'South Indian Tiffins'];

  const filteredItems = FOOD_MENU_ITEMS.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const addToCart = (item: FoodMenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prevCart,
        {
          item,
          quantity: 1,
          businessName: restaurant.name,
          businessPhone: restaurant.phone,
          businessWhatsapp: restaurant.whatsapp || restaurant.phone,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalItemCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('Please fill in your Name, Mobile Number, and Delivery Address to place the order!');
      return;
    }

    const orderId = `RK-FOOD-${Math.floor(1000 + Math.random() * 9000)}`;
    let message = `*NEW FOOD ORDER - ROYAL KORUTLA* 👑\n`;
    message += `Order ID: #${orderId}\n`;
    message += `Restaurant: ${restaurant.name}\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${customerPhone}\n`;
    message += `Delivery Address: ${deliveryAddress}\n`;
    if (landmark) message += `Landmark: ${landmark}\n`;
    if (notes) message += `Notes: ${notes}\n`;

    message += `\n*Order Items:*\n`;
    cart.forEach((ci, idx) => {
      message += `${idx + 1}. ${ci.item.name} x ${ci.quantity} = ₹${ci.item.price * ci.quantity}\n`;
    });

    message += `\n*Total Amount:* ₹${subtotal}\n`;
    message += `*Payment Mode:* Cash / UPI on Delivery\n`;
    message += `\nPlease confirm and prepare my order!`;

    const encodedMessage = encodeURIComponent(message);
    const targetWhatsapp = restaurant.whatsapp ? restaurant.whatsapp.replace(/[^0-9]/g, '') : '919876543210';
    
    window.open(`https://wa.me/${targetWhatsapp}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="rounded-3xl pastel-card p-6 sm:p-8 border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-white shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold">
                <Utensils className="w-3.5 h-3.5" />
                <span>Korutla Food &amp; Restaurant Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Food Delivery &amp; Takeaway in <span className="gradient-text-gold">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed font-medium">
                Browse menus from top restaurants in Korutla town. Add dishes to cart and send your order directly to the restaurant via <strong className="text-emerald-700">WhatsApp</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 pt-2">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.8 Rating</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-600" /> Main Road, Korutla</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-purple-600" /> 20-35 mins delivery</span>
              </div>
            </div>

            {totalItemCount > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 transition-all animate-bounce"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>View Cart ({totalItemCount} Items - ₹{subtotal})</span>
              </button>
            )}
          </div>
        </div>

        {/* Menu Categories Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const inCart = cart.find((ci) => ci.item.id === item.id);

            return (
              <div
                key={item.id}
                className="pastel-card pastel-card-hover rounded-2xl p-4 sm:p-5 flex gap-4 border border-slate-200 bg-white"
              >
                {/* Image */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                  {item.isBestseller && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-[10px] font-black text-slate-950">
                      BESTSELLER
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full border-2 ${item.isVeg ? 'border-emerald-600 bg-emerald-100' : 'border-rose-600 bg-rose-100'}`} />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.category}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mt-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-black text-amber-700">
                      ₹{item.price}
                    </span>

                    {inCart ? (
                      <div className="flex items-center gap-3 bg-slate-100 border border-amber-300 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-slate-700 hover:text-amber-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-amber-800">{inCart.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-slate-700 hover:text-amber-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>ADD</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border-l border-slate-200 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-slate-900">Your Order Basket</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold">Your food cart is empty</p>
                  <p className="text-xs text-slate-500">Add delicious biryani or tiffins from the menu!</p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Cart Items List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cart.map((ci) => (
                      <div
                        key={ci.item.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{ci.item.name}</h4>
                          <p className="text-[11px] text-amber-700 font-bold mt-0.5">₹{ci.item.price} x {ci.quantity} = ₹{ci.item.price * ci.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          <button onClick={() => updateQuantity(ci.item.id, -1)} className="text-slate-600 hover:text-slate-900">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-900">{ci.quantity}</span>
                          <button onClick={() => updateQuantity(ci.item.id, 1)} className="text-slate-600 hover:text-slate-900">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Details Form */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Delivery Information</h3>
                    
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />

                    <input
                      type="tel"
                      placeholder="Mobile Phone Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />

                    <textarea
                      placeholder="House / Street / Colony Address in Korutla *"
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />

                    <input
                      type="text"
                      placeholder="Landmark (Optional e.g. Near Old Bus Stand)"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-amber-700 text-lg">₹{subtotal}</span>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
