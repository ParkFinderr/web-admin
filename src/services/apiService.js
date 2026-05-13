// API Service for ParkFinder Admin Dashboard
// All API calls centralized here

const API_BASE_URL = 'https://backend-api-services-291631508657.asia-southeast2.run.app';

// Get token from localStorage
const getToken = () => localStorage.getItem('pf_token');

// Fetch wrapper with authorization
const fetchAPI = async (method, endpoint, body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

// ─── Authentication ───────────────────────────────────────
export const authService = {
  login: (email, password) => 
    fetchAPI('POST', '/auth/login', { email, password }),
  
  logout: () => 
    fetchAPI('POST', '/auth/logout'),
  
  register: (name, email, password, phoneNumber, plateNumber) =>
    fetchAPI('POST', '/auth/register', { name, email, password, phoneNumber, plateNumber }),
};

// ─── Admin Management ──────────────────────────────────────
export const adminService = {
  getAll: () => 
    fetchAPI('GET', '/superAdmin/admins'),
  
  getById: (adminId) => 
    fetchAPI('GET', `/superAdmin/admins/${adminId}`),
  
  create: (name, email, password) =>
    fetchAPI('POST', '/superAdmin/admins', { name, email, password }),
  
  update: (adminId, name, password) =>
    fetchAPI('PUT', `/superAdmin/admins/${adminId}`, { name, password }),
  
  delete: (adminId) =>
    fetchAPI('DELETE', `/superAdmin/admins/${adminId}`),
};

// ─── User Management ───────────────────────────────────────
export const userService = {
  getAll: () => 
    fetchAPI('GET', '/users'),
  
  getById: (userId) => 
    fetchAPI('GET', `/users/${userId}`),
  
  delete: (userId) =>
    fetchAPI('DELETE', `/users/${userId}`),
  
  getProfile: () =>
    fetchAPI('GET', '/users/profile'),
  
  updateProfile: (name, phoneNumber) =>
    fetchAPI('PUT', '/users/profile', { name, phoneNumber }),
  
  uploadProfilePhoto: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}/users/profile/photo`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(res => res.json());
  },
};

// ─── Vehicle Management ───────────────────────────────────
export const vehicleService = {
  add: (plateNumber, vehicleType) =>
    fetchAPI('POST', '/users/vehicles', { plateNumber, vehicleType }),
  
  delete: (plateNumber) =>
    fetchAPI('DELETE', `/users/vehicles/${plateNumber}`),
};

// ─── Parking Area Management ──────────────────────────────
export const parkingService = {
  getAll: () => 
    fetchAPI('GET', '/areas'),
  
  getById: (areaId) =>
    fetchAPI('GET', `/areas/${areaId}`),
  
  create: (name, location, slot) =>
    fetchAPI('POST', '/areas', { name, location, slot }),
  
  update: (areaId, name, location) =>
    fetchAPI('PUT', `/areas/${areaId}`, { name, location }),
  
  delete: (areaId) =>
    fetchAPI('DELETE', `/areas/${areaId}`),
};

// ─── Parking Slot Management ──────────────────────────────
export const slotService = {
  add: (areaId, slotNumber, vehicleType) =>
    fetchAPI('POST', '/areas/slots', { areaId, slotNumber, vehicleType }),
  
  update: (slotId, slotNumber, status) =>
    fetchAPI('PUT', `/areas/slots/${slotId}`, { slotNumber, status }),
  
  delete: (slotId) =>
    fetchAPI('DELETE', `/areas/slots/${slotId}`),
  
  getById: (slotId) =>
    fetchAPI('GET', `/areas/slots/${slotId}`),
  
  getByArea: (areaId) =>
    fetchAPI('GET', `/areas/${areaId}/slots`),
};

// ─── Access & Ticket (User) ────────────────────────────────
export const accessService = {
  verifyTicket: (ticketId) =>
    fetchAPI('POST', '/access/verify', { ticketId }),
  
  getActiveTicket: () =>
    fetchAPI('GET', '/access/activeTicket'),
  
  cancelTicket: (ticketId) =>
    fetchAPI('POST', '/access/cancelTicket', { ticketId }),
};

// ─── Access & Ticket (Guest) ───────────────────────────────
export const guestAccessService = {
  verifyTicket: (ticketId) =>
    fetchAPI('POST', '/access/verify', { ticketId }),
  
  getActiveTicket: (guestSessionId) =>
    fetchAPI('GET', `/access/activeTicket?guestSessionId=${guestSessionId}`),
  
  cancelTicket: (guestSessionId) =>
    fetchAPI('POST', '/access/cancelTicket', { guestSessionId }),
};

// ─── Dashboard Stats (custom endpoint - may need to be created) ────
export const statsService = {
  getDashboardStats: () => 
    fetchAPI('GET', '/stats/dashboard'),
  
  getBookingStats: (days = 7) =>
    fetchAPI('GET', `/stats/bookings?days=${days}`),
  
  getScanStats: () =>
    fetchAPI('GET', '/stats/scans'),
  
  getAnalytics: (period = 'week') =>
    fetchAPI('GET', `/stats/analytics?period=${period}`),
};

export default {
  authService,
  adminService,
  userService,
  vehicleService,
  parkingService,
  slotService,
  accessService,
  guestAccessService,
  statsService,
};
