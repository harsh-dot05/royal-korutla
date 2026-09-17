# ROYAL KORUTLA — GLOBAL DESIGN CONSTRAINTS

These rules apply to the ENTIRE Royal Korutla project.
Follow them for every page, component, card, button, navigation element, Admin Panel, Business Dashboard, mobile layout, and future UI change.

---

## BANNED
- ❌ **No gradient backgrounds or gradient text.** Use solid colors with clean contrast.
- ❌ **No glowing effects, light blobs, or backdrop blur.** Use clean solid surfaces (`bg-white`, `bg-slate-50`, etc.).
- ❌ **No emojis in the UI.** Use Lucide or Phosphor icons only.
- ❌ **No gradient letter avatars.** Use clean solid backgrounds with single accent or neutral gray colors.
- ❌ **No scroll-jacking.**
- ❌ **No custom easing or unnatural transition physics.**
- ❌ **No hover effects that move, hide, or resize navigation or controls.** Avoid `transform translateY`, `scale`, or position changes on hover.
- ❌ **No sticky headers that collapse, shrink, or resize while scrolling.**

---

## COLOR
- **Use ONE primary accent color** throughout the product (`#2563eb` / `blue-600` or `#1d4ed8` / `blue-700`).
- **Use neutral grays** (`slate` / `zinc`) for supporting UI.
- **Light mode** is the default.
- **Maintain accessible text contrast** (WCAG AA: 4.5:1 for normal text, 3:1 for large text/UI elements).
- Do not randomly introduce different accent colors for different categories. Category identity can use icons and imagery, but the overall interface must remain visually consistent.

---

## LAYOUT
- **Every KPI should appear only once.** Do not create duplicate statistics.
- **Do not create placeholder cards** or decorative cards that have no real purpose.
- **IMPORTANT**: `# CARDS = # REAL FEATURES`. If there are only 2 real items, show 2 cards. Do NOT artificially create 3, 4, or 6 cards just to fill a grid.
- **Empty state standard**: One short line + One useful button. Example:
  > "No promotions available."  
  > `[Explore Businesses]`
- **Dropdowns**: Must have at least 3 meaningful options. Do not create dropdowns with unnecessary options just to satisfy the rule.

---

## COPY
- **Avoid marketing filler words**:
  - ❌ `seamlessly`
  - ❌ `empower`
  - ❌ `elevate`
  - ❌ `leverage`
  - ❌ `robust`
  - ❌ `unlock`
  - ❌ `supercharge`
- **Use simple, direct language.**
- **Headlines should normally be fewer than 10 words.** Examples:
  - "Find What You Need in Korutla"
  - "Today's Offers"
  - "Featured Businesses"
  - "Local Jobs"
  - "Nearby Services"
- **Do NOT create fake**: Logos, User counts, Business counts, Ratings, Reviews, Testimonials, Statistics. Only display data that actually exists in the application/database. Mock/demo data must be clearly treated and labeled as demo data.

---

## NAVIGATION
- **Use a clear top navigation and/or mobile navigation.** Always indicate the current page.
- **Every navigation item MUST lead somewhere real.** Do NOT create buttons that appear clickable but do nothing.
- **Category navigation routes**:
  - Food & Dining → `/food`
  - Groceries & Marts → `/grocery`
  - Shopping & Apparel → `/shopping`
  - Services & Repair → `/services`
  - Hospitals & Doctors → `/hospitals`
  - Education & Tuition → `/education`
  - Public Places & Parks → `/public-places`
  - Local Jobs → `/jobs`
  - Real Estate & Rentals → `/real-estate`

---

## VISUAL DIRECTION
- The website should feel: **Premium**, **Clean**, **Local**, **Modern**, **Simple**, **Friendly**, **Mobile-first**, **App-like**.
- Use strong typography, clear spacing, consistent cards, high-quality photography, subtle borders, subtle shadows, clear hierarchy, consistent iconography.
- Avoid excessive decoration, excessive animations, excessive rounded elements, random colors, generic dashboard styling.

---

## IMAGES
- Images must have a real purpose (Hero slider, Featured businesses, Promotions, Food, Grocery, Services, Hospitals, Doctors, Jobs where appropriate, Real estate, Shopping, Education, Public places, Stories/Reels).
- Do not add images simply to fill empty space.
- Do not use stretched or badly cropped images. Use appropriate aspect ratios.

---

## FEATURED BUSINESSES vs PROMOTIONS
- **Featured Businesses**: Promote a business itself.
- **Promotions**: Promote a specific offer, campaign, discount, launch, event, etc.
- Paid promotional content must be clearly labelled as `Sponsored` or `Featured`.

---

## ADMIN PANEL
- The Admin Panel is **PRIVATE** (`/admin`, Login: `/admin/login`). Only authorized Royal Korutla owner can access it.
- **Do NOT show Admin in**: Customer navigation, Footer, Public homepage, Public menus, Business dashboard.
- Frontend route protection AND backend authorization are required.

---

## SERVICES
- Services MUST remain a separate experience at `/services` (Electrician, Plumber, Carpenter, AC Repair, Fridge Repair, Painter, Cleaning, Driver, Delivery, Beauty & Salon, Tailor, Photography, Computer Services, Mobile Repair, Vehicle Repair, RO Service, Pest Control, Home Maintenance).
- Do NOT mix Food, Grocery, Jobs, Real Estate into Services.

---

## FOOD & GROCERY
- `/food`: Restaurant → Menu → Food item → Add to Cart → Cart → Customer details → Location → Order on WhatsApp.
- `/grocery`: Store → Products → Add to Cart → Cart → Customer details → Location → Order on WhatsApp.

---

## JOBS & REAL ESTATE
- `/jobs`: Show genuine local job categories (Sales, Shop Staff, Billing, Drivers, Delivery, Hotel Staff, Restaurant Staff, Cook, Factory/Warehouse, Receptionist, Computer Operator, Data Entry, Construction, Technicians).
- `/real-estate`: BUY, RENT, SELL. Show actual property info.

---

## WHATSAPP
- Floating WhatsApp button on public pages: stays fixed, easy to tap, does not cover important controls, uses official Royal Korutla WhatsApp number, proper WhatsApp icon (Lucide icon/SVG, NO EMOJI), accessible label.

---

## VERIFICATION BEFORE REPORTING COMPLETION
Before reporting completion, list which design constraints were affected and confirm each one:
- ✓ Banned effects — confirmed
- ✓ Color system — confirmed
- ✓ Layout/card rules — confirmed
- ✓ Copy rules — confirmed
- ✓ Navigation rules — confirmed
- ✓ Admin privacy — confirmed
- ✓ Category separation — confirmed
- ✓ Mobile responsiveness — confirmed
