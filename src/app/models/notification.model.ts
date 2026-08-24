export interface CustomerNotification {
  notificationId: number;
  customerId: number;

  title?: string;
  message: string;
  type: string;

  isRead: boolean;

  createdAt: string;
}