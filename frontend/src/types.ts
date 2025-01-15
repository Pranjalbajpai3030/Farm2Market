export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'buyer' | 'seller';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  category: string;
  images: string[];
  sellerId: string;
  seller: User;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  type: 'message' | 'offer' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}