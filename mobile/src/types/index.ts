export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  _id: string;
  name: string;
  description: string;
  region: string;
  images: string[];
  highlights: string[];
  mapUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  _id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  duration: number; // mapped from durationDays
  price: number;
  images: string[];
  highlights: string[]; // mapped from includes
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  locationRefs: string[] | Location[];
  includes: string[];
  excludes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  userRef: string | User;
  packageRef: string | Package;
  date: string;
  travelers: number;
  pickupCity: string;
  phone: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  _id: string;
  receiptNo: string;
  bookingRef: string | Booking;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED';
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  LocationDetail: { locationId: string };
  PackageDetail: { packageId: string };
  BookingCheckout: { packageId: string };
  BookingSuccess: { bookingId: string };
  MyBookings: undefined;
  MyReceipts: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Home: undefined;
  Locations: undefined;
  Packages: undefined;
  Profile: undefined;
};