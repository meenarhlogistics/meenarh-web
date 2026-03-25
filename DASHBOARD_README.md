# Meenarh Logistics Dashboard

A complete user dashboard for authenticated customers to create delivery requests, view order history, and track packages in real-time.

## Features Implemented

### 1. Authentication System
- **Login Page** (`/login`) - JWT-based authentication
- **Signup Page** (`/signup`) - Customer registration with optional profile fields
- **Zustand State Management** - Global auth state with localStorage persistence
- **Auto-redirect** - Protected routes automatically redirect to login

### 2. Dashboard Layout
- **Tab Navigation** - Three main tabs: Create Order, My Orders, Track Order
- **User Profile Display** - Shows user avatar, name, and email
- **Logout Functionality** - Clears session and redirects to login
- **Mobile Responsive** - Horizontal scrollable tabs on mobile devices

### 3. Create Order (Default Tab)
**Route:** `/dashboard`

**Features:**
- Auto-fills sender information from user profile
- Three-section form:
  - Sender Information (name, phone, pickup address)
  - Receiver Information (name, phone, delivery address)
  - Package Details (description, zone, distance)
- Zone selection: Mainland, Island, Expanding
- Success state with tracking number and price
- Copy-to-clipboard for tracking number
- Form reset after successful order

### 4. Order History Tab
**Route:** `/dashboard/orders`

**Features:**
- Displays all user's orders (newest first)
- Order cards showing:
  - Tracking number (clickable to copy)
  - Receiver name and address
  - Color-coded status badges
  - Price and creation date
  - "Track Order" button
- Loading skeleton during fetch
- Empty state when no orders exist
- Error handling with retry option

### 5. Track Order Tab
**Route:** `/dashboard/track`

**Features:**
- Search by tracking number
- URL parameter support (`?tracking=MN-2026-0001`)
- Visual timeline component:
  - Completed events (green checkmark)
  - Active event (pulsing green dot)
  - Pending events (gray dot)
  - Connected vertical line
- Full order details display:
  - Sender and receiver information
  - Package description
  - Price and current status
- Event history with timestamps

## Technical Stack

### State Management
- **Zustand** - Lightweight state management
  - Auth store: `lib/store/authStore.ts`
  - User data, token, and authentication state
  - Persistent in localStorage

### API Integration
- **Axios** - HTTP client with interceptors
  - Base client: `lib/api/client.ts`
  - Auth endpoints: `lib/api/auth.ts`
  - Order endpoints: `lib/api/orders.ts`
  - Auto-attaches JWT token
  - Handles 401 errors (auto-logout)

### TypeScript Types
- Location: `types/index.ts`
- Interfaces for:
  - User, Order, OrderDetail, OrderEvent
  - API requests and responses
  - Complete type safety

### UI Components
**New Components Created:**
- `Select.tsx` - Dropdown with design system styling
- `Textarea.tsx` - Multi-line input component

**Dashboard Components:**
- `DashboardNav.tsx` - Tab navigation with user info
- `CreateOrderForm.tsx` - Order creation form
- `OrderList.tsx` - List of order cards
- `OrderCard.tsx` - Single order display
- `OrderTimeline.tsx` - Visual event timeline

## API Endpoints Used

### Authentication
- `POST /api/user/signup` - Create new customer account
- `POST /api/user/login` - Authenticate and get JWT token
- `GET /api/user/profile` - Get user profile (protected)

### Orders
- `POST /api/orders` - Create new delivery order (protected)
- `GET /api/user/orders` - Get user's order history (protected)
- `GET /api/track/:trackingNumber` - Track any order (public)

## Environment Setup

### Required Environment Variable
Create `.env.local` in the `web/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Server
Ensure the backend server is running on `http://localhost:5000`

```bash
cd ../server
npm run dev
```

### Frontend Server
The dev server is already running on `http://localhost:3000`

## Routes Summary

| Route | Auth Required | Description |
|-------|---------------|-------------|
| `/` | No | Landing page |
| `/login` | No | Login page |
| `/signup` | No | Registration page |
| `/dashboard` | Yes | Create order (main dashboard) |
| `/dashboard/orders` | Yes | Order history |
| `/dashboard/track` | Yes | Track order by number |

## Design System Compliance

All components follow the existing design system:
- **Colors:** Green/olive theme (`#5c8d1d` primary)
- **Typography:** Montserrat (sans-serif), Merriweather (serif accents)
- **Border Radius:** `rounded-lg` to `rounded-xl`
- **Shadows:** `shadow-md` for cards
- **Buttons:** Existing Button component (primary, secondary, dark variants)
- **Inputs:** Matching Input, Select, and Textarea styling

## Navigation Updates

The main site navigation now shows:
- **Logged Out:** "Login" button → `/login`
- **Logged In:** "Dashboard" button → `/dashboard`

## Status Badge Colors

Order statuses are color-coded:
- **Order Created:** Gray (muted)
- **Picked Up:** Light green
- **In Transit:** Yellow-green
- **Out for Delivery:** Green
- **Delivered:** Dark green (primary)

## Error Handling

- **Network Errors:** Display error messages with retry options
- **Validation Errors:** Inline field error messages
- **401 Unauthorized:** Auto-logout and redirect to login
- **404 Not Found:** "Order not found" message for tracking
- **Server Errors:** Generic error messages

## Mobile Responsiveness

- Tab navigation: Horizontal scroll on mobile
- Forms: Vertical stacking on small screens
- Order cards: Full width on mobile
- Timeline: Compact spacing
- All touch targets: Minimum 44x44px

## Usage Flow

1. **New User:**
   - Visit landing page → Click "Login" → "Sign up"
   - Create account → Auto-login → Redirected to dashboard
   
2. **Create Order:**
   - Dashboard opens to Create Order tab (default)
   - Sender info auto-filled from profile
   - Fill receiver and package details → Submit
   - Copy tracking number from success screen
   
3. **View Orders:**
   - Click "My Orders" tab
   - See all orders with status
   - Click tracking number to copy
   - Click "Track Order" to see details
   
4. **Track Order:**
   - Click "Track Order" tab
   - Enter tracking number → Track
   - View timeline and full order details

## Next Steps (Future Enhancements)

- Email notifications for order status changes
- Real-time updates with WebSockets
- Order cancellation functionality
- Print shipping label
- Multiple package images upload
- Address book management
- Favorite delivery locations
- Order rating and feedback
