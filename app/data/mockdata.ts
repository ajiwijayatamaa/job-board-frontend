// Mock data for the event management platform

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "organizer";
  referralCode: string;
  referredBy?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Point {
  id: string;
  userId: string;
  amount: number;
  remainingAmount: number;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  userId: string;
  couponCode: string;
  discountRate: number;
  isUsed: boolean;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  startDate: string;
  endDate: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Voucher {
  id: string;
  eventId: string;
  voucherCode: string;
  discountPercentage: number;
  quota: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  voucherId?: string;
  couponId?: string;
  ticketQuantity: number;
  totalPrice: number;
  pointsUsed?: number;
  status: "pending" | "confirmed" | "cancelled" | "expired";
  paymentProof?: string;
  paymentProofUploadedAt?: string;
  expiredAt: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  transactionId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    referralCode: "JOHN2024",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@eventpro.com",
    role: "organizer",
    referralCode: "SARAH2024",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: "1",
    organizerId: "2",
    name: "Tech Conference 2024",
    description:
      "Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities. Learn about AI, blockchain, and the future of technology.",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    location: "San Francisco Convention Center",
    availableSeats: 450,
    totalSeats: 500,
    startDate: "2024-06-15T09:00:00Z",
    endDate: "2024-06-17T18:00:00Z",
    category: "Technology",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    organizerId: "2",
    name: "Summer Music Festival",
    description:
      "Experience three days of amazing live music featuring top artists from around the world. Food, drinks, and unforgettable memories await!",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
    location: "Central Park, New York",
    availableSeats: 2000,
    totalSeats: 5000,
    startDate: "2024-07-20T12:00:00Z",
    endDate: "2024-07-22T23:00:00Z",
    category: "Music",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    organizerId: "2",
    name: "Startup Pitch Night",
    description:
      "Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and discover the next big thing in tech.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop",
    location: "Innovation Hub, Austin",
    availableSeats: 80,
    totalSeats: 100,
    startDate: "2024-05-10T18:00:00Z",
    endDate: "2024-05-10T22:00:00Z",
    category: "Business",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "4",
    organizerId: "2",
    name: "Yoga & Wellness Retreat",
    description:
      "Escape the city and rejuvenate your mind and body with our weekend wellness retreat. Includes yoga sessions, meditation, and healthy meals.",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    location: "Serenity Resort, Malibu",
    availableSeats: 25,
    totalSeats: 30,
    startDate: "2024-08-05T08:00:00Z",
    endDate: "2024-08-07T16:00:00Z",
    category: "Health",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z",
  },
  {
    id: "5",
    organizerId: "2",
    name: "Art Exhibition Opening",
    description:
      "Be among the first to experience our new contemporary art exhibition featuring works from emerging artists around the globe.",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=400&fit=crop",
    location: "Modern Art Gallery, Los Angeles",
    availableSeats: 150,
    totalSeats: 200,
    startDate: "2024-04-25T19:00:00Z",
    endDate: "2024-04-25T22:00:00Z",
    category: "Art",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "6",
    organizerId: "2",
    name: "Culinary Masterclass",
    description:
      "Learn from Michelin-starred chefs in this exclusive hands-on cooking experience. Master the art of French cuisine.",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop",
    location: "Chef Studio, Chicago",
    availableSeats: 12,
    totalSeats: 15,
    startDate: "2024-05-20T10:00:00Z",
    endDate: "2024-05-20T15:00:00Z",
    category: "Food",
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "1",
    eventId: "1",
    ticketQuantity: 2,
    totalPrice: 300,
    status: "confirmed",
    confirmedAt: "2024-03-15T14:30:00Z",
    expiredAt: "2024-03-20T14:30:00Z",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T14:30:00Z",
  },
  {
    id: "2",
    userId: "1",
    eventId: "3",
    ticketQuantity: 1,
    totalPrice: 50,
    status: "pending",
    expiredAt: "2024-03-25T10:00:00Z",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "3",
    userId: "1",
    eventId: "5",
    ticketQuantity: 3,
    totalPrice: 0,
    status: "confirmed",
    confirmedAt: "2024-03-10T09:00:00Z",
    expiredAt: "2024-03-15T09:00:00Z",
    createdAt: "2024-03-10T08:00:00Z",
    updatedAt: "2024-03-10T09:00:00Z",
  },
];

// Mock Vouchers
export const mockVouchers: Voucher[] = [
  {
    id: "1",
    eventId: "1",
    voucherCode: "EARLY20",
    discountPercentage: 20,
    quota: 50,
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-04-30T23:59:59Z",
    createdAt: "2024-02-25T10:00:00Z",
    updatedAt: "2024-02-25T10:00:00Z",
  },
  {
    id: "2",
    eventId: "2",
    voucherCode: "SUMMER15",
    discountPercentage: 15,
    quota: 100,
    startDate: "2024-04-01T00:00:00Z",
    endDate: "2024-06-30T23:59:59Z",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
];

// Mock Points
export const mockPoints: Point[] = [
  {
    id: "1",
    userId: "1",
    amount: 10000,
    remainingAmount: 8500,
    expiredAt: "2024-12-31T23:59:59Z",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-15T14:30:00Z",
  },
];

// Mock Coupons
export const mockCoupons: Coupon[] = [
  {
    id: "1",
    userId: "1",
    couponCode: "WELCOME10",
    discountRate: 10,
    isUsed: false,
    expiredAt: "2024-06-30T23:59:59Z",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: "1",
    transactionId: "1",
    userId: "1",
    rating: 5,
    comment: "Amazing conference! Learned so much and met great people.",
    createdAt: "2024-06-18T10:00:00Z",
    updatedAt: "2024-06-18T10:00:00Z",
  },
];

// Categories
export const eventCategories = [
  "All",
  "Technology",
  "Music",
  "Business",
  "Health",
  "Art",
  "Food",
  "Sports",
  "Education",
];

// Helper functions
export const getEventById = (id: string) => mockEvents.find((e) => e.id === id);
export const getUserById = (id: string) => mockUsers.find((u) => u.id === id);
export const getTransactionsByUserId = (userId: string) =>
  mockTransactions.filter((t) => t.userId === userId);
export const getTransactionsByEventId = (eventId: string) =>
  mockTransactions.filter((t) => t.eventId === eventId);
export const getVouchersByEventId = (eventId: string) =>
  mockVouchers.filter((v) => v.eventId === eventId);
