// Data Service - Bridge between API and mock data
// Provides fallback to mock data while APIs are being implemented

import {
    BOOKING_CHART_DATA,
    BOOKINGS,
    HOURLY_SCAN_DATA,
    OCCUPANCY_DATA,
    PARKINGS,
    PLATFORM_DATA,
    SCAN_LOGS,
    STATS_OVERVIEW,
    SWAP_LOGS,
    USERS,
} from '../data/mockData';
import {
    bookingService,
    parkingService,
    statsService,
    userService,
} from './apiService';

// ─── Parking Data ──────────────────────────────────
export const getParkings = async (useAPI = false) => {
  if (useAPI) {
    try {
      return await parkingService.getAll();
    } catch (error) {
      console.warn('Parking API failed, using mock data:', error);
    }
  }
  return PARKINGS;
};

export const getParkingById = async (parkingId, useAPI = false) => {
  if (useAPI) {
    try {
      return await parkingService.getById(parkingId);
    } catch (error) {
      console.warn('Parking API failed, using mock data:', error);
    }
  }
  return PARKINGS.find(p => p.id === parkingId);
};

// ─── User Data ─────────────────────────────────────
export const getUsers = async (useAPI = false) => {
  if (useAPI) {
    try {
      return await userService.getAll();
    } catch (error) {
      console.warn('User API failed, using mock data:', error);
    }
  }
  return USERS;
};

export const getUserById = async (userId, useAPI = false) => {
  if (useAPI) {
    try {
      return await userService.getById(userId);
    } catch (error) {
      console.warn('User API failed, using mock data:', error);
    }
  }
  return USERS.find(u => u.id === userId);
};

// ─── Dashboard Stats ──────────────────────────────
export const getDashboardStats = async (useAPI = false) => {
  if (useAPI) {
    try {
      return await statsService.getDashboardStats();
    } catch (error) {
      console.warn('Stats API failed, using mock data:', error);
    }
  }
  return STATS_OVERVIEW;
};

export const getBookingStats = async (days = 7, useAPI = false) => {
  if (useAPI) {
    try {
      return await statsService.getBookingStats(days);
    } catch (error) {
      console.warn('Booking stats API failed, using mock data:', error);
    }
  }
  return BOOKING_CHART_DATA;
};

export const getScanStats = async (useAPI = false) => {
  if (useAPI) {
    try {
      return await statsService.getScanStats();
    } catch (error) {
      console.warn('Scan stats API failed, using mock data:', error);
    }
  }
  return HOURLY_SCAN_DATA;
};

export const getOccupancyData = async (useAPI = false) => {
  if (useAPI) {
    try {
      const parkings = await parkingService.getAll();
      return parkings.map(p => ({ name: p.shortName, value: p.occupancy }));
    } catch (error) {
      console.warn('Occupancy API failed, using mock data:', error);
    }
  }
  return OCCUPANCY_DATA;
};

export const getPlatformData = async (useAPI = false) => {
  // Platform data might come from analytics endpoint
  if (useAPI) {
    try {
      const analytics = await statsService.getAnalytics('today');
      return analytics.platformBreakdown;
    } catch (error) {
      console.warn('Platform API failed, using mock data:', error);
    }
  }
  return PLATFORM_DATA;
};

// ─── Booking Data (currently in mock) ──────────────
export const getBookings = async (useAPI = false, query = '') => {
  if (useAPI) {
    try {
      const q = typeof query === 'string' ? query : '';
      return await bookingService.list(q);
    } catch (error) {
      console.warn('Bookings API failed, using mock data:', error);
    }
  }
  return BOOKINGS;
};

// ─── Scan Data (currently in mock) ────────────────
export const getScans = () => SCAN_LOGS;

// ─── Swap Data (currently in mock) ────────────────
export const getSwaps = () => SWAP_LOGS;

export default {
  getParkings,
  getParkingById,
  getUsers,
  getUserById,
  getDashboardStats,
  getBookingStats,
  getScanStats,
  getOccupancyData,
  getPlatformData,
  getBookings,
  getScans,
  getSwaps,
};
