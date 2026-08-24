export interface BookingEvent {
  eventId: number;
  eventName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  parkingFee: number;
  status: string;
}

export interface BookingPayment {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: string;
  paymentDate: string;
}

export interface CustomerBooking {
  bookingId: number;
  bookingNumber: string;

  customerId: number;
  eventId: number;

  bookingDate: string;

  totalSeats: number;
  totalAmount: number;

  status: string;
  paymentStatus: string;

  holdExpiresAt?: string | null;

  event?: BookingEvent | null;
  payment?: BookingPayment | null;
}
export interface CreateBookingRequest {
  customerId: number;
  eventId: number;
  totalSeats: number;
  totalAmount: number;
  status: string;
}

export interface CreateBookingResponse {
  bookingId: number;
  bookingNumber: string;
  customerId: number;
  eventId: number;
  bookingDate: string;
  totalSeats: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  holdExpiresAt?: string | null;
}