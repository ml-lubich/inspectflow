# CLAUDE.md — InspectFlow

## Project Overview
InspectFlow is a modern, affordable home inspection report software for independent home inspectors. Competitors (Spectora $109/mo, HomeGauge $89/mo, Home Inspector Pro $74/mo) are overpriced for solo/small operators. InspectFlow costs $19/mo.

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **UI Components:** Radix UI primitives + custom components
- **Icons:** Lucide React
- **PDF:** jspdf + html2canvas
- **Animations:** Framer Motion
- **Package Manager:** Bun

## Architecture
- `/src/app/` — App Router pages
- `/src/components/` — Reusable components
- `/src/lib/` — Utility functions, Supabase client, types
- `/src/app/api/` — API routes

## Core Features (ALL MUST BE BUILT)

### 1. Landing Page (/)
Beautiful, conversion-optimized landing page:
- Hero: "Professional Inspection Reports in Minutes. Not Hours." with pricing comparison
- Feature showcase: Templates, Photo Uploads, PDF Export, Scheduling, Client Portal
- Pricing section: $19/mo vs competitors side-by-side
- Testimonials section (mock data)
- CTA buttons throughout
- Mobile responsive, dark/light color scheme (professional blues/grays)

### 2. Authentication (/login, /signup)
- Supabase Auth with email/password
- Clean login/signup forms
- Protected dashboard routes

### 3. Dashboard (/dashboard)
- Overview: Recent inspections, upcoming scheduled, stats
- Quick actions: New Inspection, View Reports, Manage Templates
- Sidebar navigation

### 4. Inspection Builder (/dashboard/inspections/new)
This is THE core feature. A multi-step form:
- **Step 1:** Property Details (address, type, year built, sq ft, bedrooms/baths)
- **Step 2:** Inspection Checklist — Category-based with ratings:
  - Exterior (Roof, Siding, Foundation, Gutters, Driveway, Landscaping)
  - Interior (Walls/Ceilings, Flooring, Windows/Doors, Stairs/Railings)
  - Kitchen (Countertops, Cabinets, Sink/Faucet, Appliances, Ventilation)
  - Bathrooms (Toilet, Tub/Shower, Sink, Ventilation, Tile/Grout)
  - Electrical (Service Panel, Outlets, Switches, Wiring, GFCI)
  - Plumbing (Water Heater, Supply Lines, Drain Lines, Fixtures, Water Pressure)
  - HVAC (Furnace/Boiler, AC, Ductwork, Thermostat, Ventilation)
  - Attic (Insulation, Ventilation, Structure, Pests)
  - Garage (Door/Opener, Floor, Electrical, Fire Separation)
  - Each item has: Rating (Good/Fair/Poor/Not Inspected), Notes field, Photo upload slots
- **Step 3:** Summary & Deficiencies — Auto-generated summary of issues
- **Step 4:** Review & Generate PDF

### 5. Reports (/dashboard/reports)
- List of completed inspections
- View report details
- Download PDF
- Share via link (public shareable URL)

### 6. PDF Export
Professional inspection report PDF:
- Company header/logo
- Property details
- All checklist items with ratings, notes, and photos
- Summary of deficiencies
- Inspector signature line
- Clean, professional formatting

### 7. Templates (/dashboard/templates)
- Default residential template (pre-filled)
- Ability to customize checklist items
- Save custom templates

### 8. Settings (/dashboard/settings)
- Company name, logo, contact info
- Default template selection
- Notification preferences

## Design System
- Primary: Blue (#2563EB) — professional, trustworthy
- Background: White/Light gray
- Text: Dark gray (#1F2937)
- Accents: Green for "Good", Yellow for "Fair", Red for "Poor"
- Font: Inter or system fonts
- Rounded corners, subtle shadows, clean modern aesthetic
- Mobile-first responsive design

## Database Schema (Supabase)
Tables needed:
- `profiles` (id, user_id, company_name, company_logo_url, phone, email, license_number)
- `inspections` (id, user_id, property_address, property_type, year_built, sq_ft, bedrooms, bathrooms, status, created_at, scheduled_date, client_name, client_email, share_token)
- `inspection_items` (id, inspection_id, category, item_name, rating, notes, sort_order)
- `inspection_photos` (id, inspection_item_id, photo_url, caption)
- `templates` (id, user_id, name, is_default, categories JSON)

## Important Notes
- This is a DEMO/LANDING PAGE focused build. Auth and dashboard should work visually with mock data where Supabase tables don't exist yet.
- Focus on making the landing page STUNNING — it's the sales page.
- The inspection builder should be functional with local state even without full DB integration.
- PDF export should work with client-side generation.
- All pages must compile and render without errors.
- Use `bun run build` to verify — ZERO errors allowed.

## File Structure Convention
- Components in `/src/components/ui/` for primitives
- Components in `/src/components/` for features
- Lib files in `/src/lib/`
- Use `cn()` utility for conditional classnames (clsx + tailwind-merge)

## Colors/Theme (Tailwind)
Use Tailwind's built-in utility classes:
- Primary actions: `bg-blue-600 hover:bg-blue-700 text-white`
- Secondary: `bg-gray-100 hover:bg-gray-200 text-gray-800`
- Success/Good: `bg-green-100 text-green-800`
- Warning/Fair: `bg-yellow-100 text-yellow-800`
- Danger/Poor: `bg-red-100 text-red-800`
- Card backgrounds: `bg-white shadow-sm border rounded-xl`
