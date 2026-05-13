# API Completion Report - ParkFinder Admin Dashboard

## Overview

This document outlines the API endpoints that are missing, incomplete, or need additional implementation to fully support the ParkFinder Admin Dashboard features.

---

## Missing Endpoints

### 1. Dashboard Statistics Endpoints
**Status**: ❌ NOT IN API DOCUMENTATION

The dashboard requires aggregated statistics that are not documented in the current API spec. These need to be created:

#### GET `/stats/dashboard`
- **Purpose**: Get overall dashboard statistics
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "totalUsers": "number",
  "activeBookings": "number",
  "totalParkings": "number",
  "todayBookings": "number",
  "successRate": "number (percentage)",
  "swapRequests": "number",
  "activeScans": "number"
}
```

#### GET `/stats/bookings?days=7`
- **Purpose**: Get booking statistics for a specific period
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `days`: number of days to retrieve (default: 7)
- **Response**:
```json
[
  {
    "name": "day_of_week",
    "bookings": "number",
    "scans": "number",
    "swaps": "number"
  }
]
```

#### GET `/stats/scans`
- **Purpose**: Get hourly scan statistics for today
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
[
  {
    "hour": "HH:00",
    "masuk": "number",
    "keluar": "number"
  }
]
```

#### GET `/stats/analytics?period=week`
- **Purpose**: Get detailed analytics for various periods
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period`: 'today' | 'week' | 'month' | 'year'
- **Response**:
```json
{
  "bookingTrend": [...],
  "platformBreakdown": [...],
  "successRate": [...],
  "occupancyByParking": [...]
}
```

---

### 2. Booking Management Endpoints
**Status**: ⚠️ PARTIALLY DOCUMENTED

The API has no endpoints for retrieving bookings. Need to add:

#### GET `/bookings`
- **Purpose**: Get all bookings with filtering and pagination
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: page number (default: 1)
  - `limit`: items per page (default: 10)
  - `status`: filter by status ('active', 'completed', 'swapped', 'cancelled')
  - `parkingId`: filter by parking area
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "userId": "string",
      "userName": "string",
      "userPhone": "string",
      "plate": "string",
      "parkingId": "string",
      "parkingName": "string",
      "floor": "string",
      "slot": "string",
      "status": "active|completed|swapped|cancelled",
      "createdAt": "ISO8601",
      "scanTime": "ISO8601",
      "duration": "string",
      "exitTime": "ISO8601"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### GET `/bookings/{bookingId}`
- **Purpose**: Get booking details
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Single booking object

#### DELETE `/bookings/{bookingId}`
- **Purpose**: Cancel a booking
- **Headers**: `Authorization: Bearer <token>`

---

### 3. Scan Log Endpoints
**Status**: ❌ NOT IN API DOCUMENTATION

#### GET `/scans`
- **Purpose**: Get all scan logs with filtering
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: page number
  - `limit`: items per page
  - `status`: 'success' | 'failed'
  - `action`: 'masuk' | 'keluar'
  - `parkingId`: filter by parking
  - `startDate`: ISO8601 date
  - `endDate`: ISO8601 date
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "ticketCode": "string",
      "userName": "string",
      "plate": "string",
      "parking": "string",
      "scanTime": "ISO8601",
      "action": "masuk|keluar",
      "status": "success|failed"
    }
  ],
  "total": "number"
}
```

---

### 4. Slot Swap/Ticket Exchange Endpoints
**Status**: ❌ NOT IN API DOCUMENTATION

#### GET `/swaps`
- **Purpose**: Get all slot swap requests
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: page number
  - `status`: 'pending' | 'success' | 'failed'
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "ticketOld": "string",
      "ticketNew": "string|null",
      "userName": "string",
      "plate": "string",
      "fromParking": "string",
      "fromSlot": "string",
      "toParking": "string",
      "toSlot": "string",
      "swapTime": "ISO8601",
      "status": "pending|success|failed"
    }
  ],
  "total": "number"
}
```

#### POST `/swaps/{swapId}/approve`
- **Purpose**: Approve a pending swap
- **Headers**: `Authorization: Bearer <token>`

#### POST `/swaps/{swapId}/reject`
- **Purpose**: Reject a pending swap
- **Headers**: `Authorization: Bearer <token>`

---

### 5. Staff Management Endpoints
**Status**: ⚠️ INCOMPLETE

The current documentation lacks specific staff management. Add:

#### GET `/staff`
- **Purpose**: Get all staff accounts
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "parkingId": "string",
    "parkingName": "string"
  }
]
```

#### POST `/staff`
- **Purpose**: Create new staff account
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "parkingId": "string"
}
```

#### PUT `/staff/{staffId}/password`
- **Purpose**: Reset staff password
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "password": "string"
}
```

#### DELETE `/staff/{staffId}`
- **Purpose**: Remove staff account
- **Headers**: `Authorization: Bearer <token>`

---

### 6. Enhanced Profile Update Endpoint
**Status**: ⚠️ INCOMPLETE

Current endpoint only supports basic profile update. Add photo upload via file:

#### POST `/users/profile/photo`
**Current Implementation**: ✓ Already documented
**Note**: Ensure this returns the uploaded photo URL

---

### 7. Parking Occupancy Real-time Endpoint
**Status**: ❌ NOT IN API DOCUMENTATION

#### GET `/areas/{areaId}/occupancy`
- **Purpose**: Get real-time occupancy info for a parking area
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "areaId": "string",
  "totalSlots": "number",
  "usedSlots": "number",
  "availableSlots": "number",
  "occupancy": "number (percentage)",
  "status": "tersedia|ramai|penuh",
  "lastUpdated": "ISO8601"
}
```

---

### 8. Authentication - Staff Login Endpoint
**Status**: ⚠️ INCOMPLETE

Current API only documents general login. Need specific staff login support:

#### POST `/auth/staff/login`
- **Purpose**: Login for staff members
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "token": "jwt_token",
  "staff": {
    "id": "string",
    "name": "string",
    "email": "string",
    "parkingId": "string",
    "parkingName": "string"
  }
}
```

---

## Summary of Action Items

### High Priority (Critical for Dashboard)
- [ ] Implement `/stats/dashboard` endpoint
- [ ] Implement `/stats/bookings` endpoint
- [ ] Implement `/stats/scans` endpoint
- [ ] Implement `/bookings` GET endpoint
- [ ] Implement `/scans` GET endpoint
- [ ] Implement `/swaps` GET endpoint

### Medium Priority (Important for Full Features)
- [ ] Implement `/staff` management endpoints
- [ ] Implement `/areas/{areaId}/occupancy` endpoint
- [ ] Enhance `/auth/login` or create `/auth/staff/login`
- [ ] Add approval/rejection for swap requests

### Low Priority (Nice to Have)
- [ ] Improve analytics with more granular data
- [ ] Add export/download capabilities
- [ ] Real-time WebSocket updates for scans

---

## Integration Notes

1. **Fallback to Mock Data**: The frontend currently uses mock data as fallback while APIs are being implemented. See `src/services/dataService.js` for fallback logic.

2. **API Service Location**: All API calls are centralized in `src/services/apiService.js`.

3. **Test Data**: Mock data is available in `src/data/mockData.js` for reference and testing.

4. **Token Management**: Authentication token is stored in `localStorage` as `pf_token`.

---

## Implementation Checklist

After implementing the missing endpoints:

- [ ] Test each endpoint with valid token
- [ ] Verify response format matches documentation
- [ ] Update `src/services/apiService.js` if endpoints differ
- [ ] Update `src/services/dataService.js` to enable API calls (set `useAPI=true`)
- [ ] Test dashboard with real data
- [ ] Verify all pages work correctly
- [ ] Remove mock data from imports once fully integrated

---

**Last Updated**: May 13, 2026
**Status**: Pending Backend Implementation
