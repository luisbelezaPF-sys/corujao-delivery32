// Tipos para o sistema de delivery do Corujão Lanches & Açaí

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'hamburger' | 'special' | 'chicken' | 'pork' | 'simple';
  image: string;
  ingredients?: string[];
}

export interface AcaiSize {
  size: '300ml' | '400ml' | '500ml' | '700ml';
  price: number;
}

export interface AcaiTopping {
  name: string;
  price: number;
}

export interface AcaiItem {
  id: string;
  size: AcaiSize;
  toppings: AcaiTopping[];
  totalPrice: number;
}

export interface Additional {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  type: 'product' | 'acai';
  name: string;
  price: number;
  quantity: number;
  additionals?: Additional[];
  acaiDetails?: AcaiItem;
  image?: string;
}

export interface DeliveryInfo {
  name: string;
  address: string;
  number: string;
  neighborhood: string;
  reference: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'pix' | 'card' | 'cash';
  observations: string;
}

export interface Order {
  items: CartItem[];
  total: number;
  deliveryInfo: DeliveryInfo;
  timestamp: Date;
}