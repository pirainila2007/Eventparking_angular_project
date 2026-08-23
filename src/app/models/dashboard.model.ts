export interface CustomerDashboard {
  upcomingBookings: UpcomingBooking[];
  reservedParking: ReservedParking[];
  recentPayments: RecentPayment[];
  unreadNotificationCount: number;
}

export interface UpcomingBooking {
  bookingId: number;
  bookingNumber: string;
  eventName: string;
  eventDate: string;
  status: string;
  totalAmount: number;
}

export interface ReservedParking {
  bookingId: number;
  eventName: string;
  slotNumber: string;
  status: string;
}

export interface RecentPayment {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentStatus: string;
  paymentDate: string;
}