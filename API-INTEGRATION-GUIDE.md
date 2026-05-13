# ParkFinder Admin Dashboard - API Integration Guide

## Summary of Changes

This document outlines all the changes made to integrate the ParkFinder Admin Dashboard with the backend API.

---

## Files Created

### 1. **`src/services/apiService.js`** (New)
Centralized API service layer that handles all HTTP requests to the backend.

**Key Features:**
- Base URL: `https://backend-api-services-291631508657.asia-southeast2.run.app`
- Automatic token management from localStorage
- Error handling and logging
- Fetch wrapper with authorization headers
- Organized by functional groups:
  - `authService` - Login, logout, register
  - `adminService` - Admin CRUD operations
  - `userService` - User management and profile
  - `vehicleService` - Vehicle management
  - `parkingService` - Parking area management
  - `slotService` - Parking slot management
  - `accessService` - Ticket access (authenticated users)
  - `guestAccessService` - Guest ticket access
  - `statsService` - Dashboard statistics (NOT YET IN BACKEND)

### 2. **`src/services/dataService.js`** (New)
Data abstraction layer that bridges mock data and API calls.

**Key Features:**
- Provides unified interface for all data fetching
- Supports fallback to mock data (for development/testing)
- Async/await based functions:
  - `getParkings(useAPI)` - Fetch all parkings
  - `getUsers(useAPI)` - Fetch all users
  - `getDashboardStats(useAPI)` - Dashboard overview stats
  - `getBookingStats(days, useAPI)` - Booking trends
  - `getScanStats(useAPI)` - Hourly scan data
  - `getOccupancyData(useAPI)` - Parking occupancy
  - `getPlatformData(useAPI)` - User platform breakdown
  - Plus more...

### 3. **`fix-admin.md`** (New)
Comprehensive documentation of missing and incomplete API endpoints.

**Documented Issues:**
- Missing `/stats/*` endpoints for dashboard
- Missing `/bookings` GET endpoints
- Missing `/scans` GET endpoints
- Missing `/swaps` GET endpoints
- Incomplete staff management endpoints
- Missing real-time occupancy endpoints
- Missing staff-specific login endpoint

---

## Files Modified

### **Pages Updated with API Integration**

All pages now use `useState` and `useEffect` to fetch data from API with fallback to mock data.

#### 1. **`src/pages/Dashboard.jsx`**
- Added data loading from `dataService`
- State management: `stats`, `parkings`, `bookings`, `scans`, `chartData`, `occupancyData`, `platformData`, `scanHourlyData`
- Uses `useEffect` to load all data on mount
- Fallback to mock data if API fails
- Dynamic STATS_CONFIG generation from loaded data

#### 2. **`src/pages/ParkingsPage.jsx`**
- Added loading state and error handling
- Fetches parkings from API via `dataService.getParkings(false)`
- Maintains local state for user modifications

#### 3. **`src/pages/UsersPage.jsx`**
- Added loading state
- Fetches users from API via `dataService.getUsers(false)`
- Calculates stats from loaded user data

#### 4. **`src/pages/BookingsPage.jsx`**
- Added loading state and pagination support
- Fetches bookings from API via `dataService.getBookings()`
- Maintains search and filter state

#### 5. **`src/pages/ScansPage.jsx`**
- Added loading state
- Fetches scans from API via `dataService.getScans()`
- Merges with local EXTRA_SCANS for completeness
- Implements complex filtering (action, status, search)

#### 6. **`src/pages/SwapsPage.jsx`**
- Added loading state
- Fetches swaps from API via `dataService.getSwaps()`
- Merges with local MORE_SWAPS for completeness
- Supports status filtering (pending, success, failed)

#### 7. **`src/pages/AnalyticsPage.jsx`**
- Added loading state for analytics data
- Fetches occupancy, platform, booking chart, and scan hourly data
- Uses safe fallback data structures
- Maintains local MONTHLY_DATA and SUCCESS_RATE_DATA

#### 8. **`src/pages/StaffDashboard.jsx`**
- Added loading state
- Fetches parkings, bookings, scans, swaps, and hourly scan data
- Reorganized filtering logic:
  - First filter by parking (based on staff's assigned parking)
  - Then filter by search term
- Updated variable names for clarity (searchFilteredScans, searchFilteredBookings, searchFilteredSwaps)

### **`src/context/AppContext.jsx`**
- Added import for `authService` from apiService
- Ready for API-based authentication (currently using fallback to local validation)
- Token management via localStorage

---

## Current Implementation Status

### ✅ Completed
- API service layer with all documented endpoints
- Data service with fallback to mock data
- All pages connected to data service
- Support for concurrent data loading with Promise.all
- Error handling and logging

### ⚠️ Partially Complete
- Authentication (needs `/auth/staff/login` endpoint)
- Staff management (partial endpoints)

### ❌ Not Yet Implemented (Backend Side)
- `/stats/dashboard` endpoint
- `/stats/bookings` endpoint
- `/stats/scans` endpoint
- `/stats/analytics` endpoint
- `/bookings` GET endpoint
- `/scans` GET endpoint
- `/swaps` GET endpoint
- `/areas/{areaId}/occupancy` endpoint
- `/auth/staff/login` endpoint
- Staff management endpoints

**See `fix-admin.md` for detailed specifications.**

---

## How to Enable API Calls

Currently, all data services use `useAPI=false` (fallback to mock data). To enable real API calls:

### Option 1: Enable for Specific Services
Update `src/services/dataService.js` function calls:

```javascript
// Before (using mock data)
const data = await dataService.getParkings(false);

// After (using API)
const data = await dataService.getParkings(true);
```

### Option 2: Create Environment Config
Create a `.env` file:
```
VITE_USE_API=false  # Change to true when backend is ready
```

Then in dataService:
```javascript
const useAPI = import.meta.env.VITE_USE_API === 'true';
const data = await dataService.getParkings(useAPI);
```

---

## Authentication Flow

1. User enters credentials on login page
2. `AppContext.loginAdmin()` or `loginStaff()` is called
3. Currently validates against local storage
4. Token should be stored in localStorage as `pf_token` after API login
5. All subsequent API calls include token in Authorization header

**Note:** This will be updated when staff login API endpoint is implemented.

---

## Error Handling Strategy

All data service functions implement try-catch:
```javascript
try {
  const data = await apiService.getParkings();
  setData(data);
} catch (error) {
  console.error('Error loading data:', error);
  // Falls back to empty state or mock data
  setLoading(false);
}
```

---

## Mock Data for Development

Mock data is available in `src/data/mockData.js`:
- `STATS_OVERVIEW` - Dashboard statistics
- `PARKINGS` - Parking areas list (6 locations)
- `BOOKINGS` - Active/completed bookings
- `USERS` - Mobile and web users
- `SCAN_LOGS` - QR scan records
- `SWAP_LOGS` - Parking swap requests
- `BOOKING_CHART_DATA` - 7-day booking trends
- `OCCUPANCY_DATA` - Occupancy by parking
- `HOURLY_SCAN_DATA` - Hourly scan breakdown
- `PLATFORM_DATA` - Mobile vs Web user split

---

## Testing Recommendations

### Frontend Testing
1. **Verify API calls are made:**
   - Open DevTools > Network tab
   - Check API endpoints are called with correct parameters
   - Verify Authorization headers are sent

2. **Test fallback behavior:**
   - Disconnect network or use DevTools offline mode
   - Verify app shows mock data and doesn't crash

3. **Test authentication:**
   - Login attempts with valid/invalid credentials
   - Verify token is stored in localStorage
   - Verify token is sent in API headers

### API Testing (When Backend is Ready)
1. Test each endpoint individually with Postman/Insomnia
2. Verify response format matches documentation
3. Test with invalid tokens (expect 401)
4. Test with missing required fields (expect 400)
5. Test rate limiting and error responses

---

## Next Steps

1. **Backend Implementation:**
   - Implement missing API endpoints (see fix-admin.md)
   - Ensure response format matches documentation
   - Add proper error handling

2. **Frontend Enhancement:**
   - Replace mock data imports with API calls (set `useAPI=true`)
   - Add loading spinners/skeletons for better UX
   - Implement proper error messages for users
   - Add data refresh/refetch functionality

3. **Authentication:**
   - Implement `/auth/staff/login` endpoint
   - Update `AppContext.loginStaff()` to use API
   - Add token refresh logic if needed

4. **Real-time Updates:**
   - Consider WebSocket for live scan/booking updates
   - Implement polling mechanism if WebSocket not available

---

## File Structure Reference

```
src/
├── pages/
│   ├── Dashboard.jsx (✓ Updated)
│   ├── ParkingsPage.jsx (✓ Updated)
│   ├── BookingsPage.jsx (✓ Updated)
│   ├── UsersPage.jsx (✓ Updated)
│   ├── ScansPage.jsx (✓ Updated)
│   ├── SwapsPage.jsx (✓ Updated)
│   ├── AnalyticsPage.jsx (✓ Updated)
│   ├── StaffDashboard.jsx (✓ Updated)
│   └── ...other pages
├── services/
│   ├── apiService.js (✓ NEW - API calls)
│   └── dataService.js (✓ NEW - Data abstraction)
├── context/
│   └── AppContext.jsx (✓ Updated)
├── data/
│   └── mockData.js (Kept for fallback)
└── ...

Root:
└── fix-admin.md (✓ NEW - API requirements doc)
```

---

## Quick Reference: Common Tasks

### Add a new API endpoint
1. Add to `apiService.js` with proper error handling
2. Add wrapper in `dataService.js` with fallback
3. Update page component to use `dataService` function
4. Test with mock data first

### Enable API for a feature
1. Change `useAPI=false` to `useAPI=true` in dataService call
2. Verify backend endpoint exists and matches spec
3. Test with network tab open
4. Verify token is sent for protected routes

### Debug API issues
1. Check Network tab in DevTools
2. Verify endpoint URL and method
3. Check request/response headers
4. Look at console for error logs
5. Verify backend is returning expected format

---

**Last Updated:** May 13, 2026  
**Status:** Ready for Backend API Implementation
