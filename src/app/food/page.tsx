'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES, FOOD_MENU_ITEMS } from '@/data/mockData';
import { FoodMenuItem, CartItem } from '@/types';
import { Utensils, ShoppingBag, Plus, Minus, Star, MapPin, Clock, MessageCircle, X } from 'lucide-react';
import { ROYAL_KORUTLA_WHATSAPP_NUMBER } from '@/config/contact';

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

    const orderId = `RK-FOOD-${Date.now().toString().slice(-6)}`;
    let message = `*NEW FOOD ORDER - ROYAL KORUTLA*\n`;
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
    const targetWhatsapp = restaurant.whatsapp ? restaurant.whatsapp.replace(/[^0-9]/g, '') : ROYAL_KORUTLA_WHATSAPP_NUMBER;
    
    window.open(`https://wa.me/${targetWhatsapp}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[#E8E5DF] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F0] border border-[#F8CFBE] text-[#E66A32] text-xs font-bold">
                <Utensils className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Korutla Food &amp; Restaurant</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26352D] tracking-tight">
                Food Delivery &amp; Takeaway in <span className="text-[#E66A32]">Korutla</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#647067] max-w-xl leading-relaxed font-normal">
                Browse menus from premier dining places in Korutla town. Add dishes to cart and order directly on WhatsApp.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#647067] pt-2">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#E66A32] fill-[#E66A32]" /> 4.8 Rating</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#E66A32]" /> Main Road, Korutla</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#E66A32]" /> 20-35 mins delivery</span>
              </div>
            </div>

            {totalItemCount > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xs transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>View Cart ({totalItemCount} Items - ₹{subtotal})</span>
              </button>
            )}
          </div>
        </div>

        {/* Menu Categories Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#E66A32] text-white shadow-xs'
                  : 'bg-white text-[#647067] hover:text-[#26352D] border border-[#E8E5DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-4">
            <p className="text-sm font-semibold text-[#26352D]">No food items match your selected category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs transition-colors"
            >
              View All Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => {
              const inCart = cart.find((ci) => ci.item.id === item.id);

              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 sm:p-5 flex gap-4 border border-[#E8E5DF] hover:border-[#E66A32] bg-white shadow-xs transition-all"
                >
                  {/* Image */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E5DF]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                    {item.isBestseller && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#E66A32] text-[10px] font-bold text-white shadow-2xs">
                        BESTSELLER
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        <span className="text-[11px] font-bold text-[#647067] uppercase tracking-wider">{item.category}</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#26352D] leading-snug mt-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#647067] mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-base font-extrabold text-[#E66A32]">
                        ₹{item.price}
                      </span>

                      {inCart ? (
                        <div className="flex items-center gap-3 bg-[#FFF6F0] border border-[#F8CFBE] rounded-xl px-2.5 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-[#26352D] hover:text-[#E66A32]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-[#E66A32]">{inCart.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-[#26352D] hover:text-[#E66A32]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#26352D]/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border-l border-[#E8E5DF] h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF]">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#E66A32]" />
                  <h2 className="text-lg font-bold text-[#26352D]">Your Food Cart</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-lg bg-[#FAF7F2] text-[#647067] hover:text-[#26352D]"
                  aria-label="Close Cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-[#647067] space-y-3">
                  <ShoppingBag className="w-12 h-12 text-[#647067]/40 mx-auto" />
                  <p className="text-sm font-semibold text-[#26352D]">Your food cart is empty</p>
                  <p className="text-xs text-[#647067]">Add dishes from the menu to start!</p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Cart Items List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cart.map((ci) => (
                      <div
                        key={ci.item.id}
                        className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-[#26352D]">{ci.item.name}</h4>
                          <p className="text-[11px] text-[#E66A32] font-bold mt-0.5">₹{ci.item.price} x {ci.quantity} = ₹{ci.item.price * ci.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-[#E8E5DF]">
                          <button onClick={() => updateQuantity(ci.item.id, -1)} className="text-[#647067] hover:text-[#26352D]">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#26352D]">{ci.quantity}</span>
                          <button onClick={() => updateQuantity(ci.item.id, 1)} className="text-[#647067] hover:text-[#26352D]">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Details Form */}
                  <div className="pt-4 border-t border-[#E8E5DF] space-y-3">
                    <h3 className="text-xs font-bold text-[#647067] uppercase tracking-wider">Delivery Details</h3>
                    
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-xs text-[#26352D] focus:outline-none"
                    />

                    <input
                      type="tel"
                      placeholder="Mobile Phone Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-xs text-[#26352D] focus:outline-none"
                    />

                    <textarea
                      placeholder="Delivery Address in Korutla *"
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-xs text-[#26352D] focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Landmark (e.g. Near Old Bus Stand)"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-xs text-[#26352D] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#E8E5DF] space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#647067] font-medium">Subtotal</span>
                  <span className="text-[#26352D] font-bold">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[#26352D]">
                  <span>Total Amount</span>
                  <span className="text-[#E66A32] text-lg">₹{subtotal}</span>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
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
