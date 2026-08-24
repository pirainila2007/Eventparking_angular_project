export interface CreatePaymentRequest {
  bookingId: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: string;
  paymentDate: string;
}