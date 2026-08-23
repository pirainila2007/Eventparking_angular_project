export interface EventVenue {
  venueId: number;
  venueName: string;
  location: string;
  capacity: number;
  description: string;
  status: string;
}

export interface EventCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  status: string;
}

export interface ParkingEvent {
  eventId: number;

  eventName: string;

  eventDate: string;

  startTime: string;

  endTime: string;

  description: string;

  ticketPrice: number;

  parkingFee: number;

  capacity: number;

  status: string;

  venueId: number;

  categoryId: number;

  venue?: EventVenue | null;

  category?: EventCategory | null;
}