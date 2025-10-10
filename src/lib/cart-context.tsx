'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, DeliveryInfo } from '@/lib/types';

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  showOrderSummary: boolean;
  showDeliveryForm: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SHOW_ORDER_SUMMARY' }
  | { type: 'SHOW_DELIVERY_FORM' }
  | { type: 'CLOSE_MODALS' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  showOrderSummary: () => void;
  showDeliveryForm: () => void;
  closeModals: () => void;
  sendToWhatsApp: (deliveryInfo: DeliveryInfo) => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => 
        item.name === action.payload.name && 
        JSON.stringify(item.additionals) === JSON.stringify(action.payload.additionals) &&
        JSON.stringify(item.acaiDetails) === JSON.stringify(action.payload.acaiDetails)
      );
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      } else {
        const newItem = { ...action.payload, id: Date.now().toString() };
        const updatedItems = [...state.items, newItem];
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      }

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SHOW_ORDER_SUMMARY':
      return { ...state, isOpen: false, showOrderSummary: true };

    case 'SHOW_DELIVERY_FORM':
      return { ...state, showOrderSummary: false, showDeliveryForm: true };

    case 'CLOSE_MODALS':
      return { ...state, isOpen: false, showOrderSummary: false, showDeliveryForm: false };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isOpen: false,
    showOrderSummary: false,
    showDeliveryForm: false,
  });

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, id: '' } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const showOrderSummary = () => {
    dispatch({ type: 'SHOW_ORDER_SUMMARY' });
  };

  const showDeliveryForm = () => {
    dispatch({ type: 'SHOW_DELIVERY_FORM' });
  };

  const closeModals = () => {
    dispatch({ type: 'CLOSE_MODALS' });
  };

  const sendToWhatsApp = (deliveryInfo: DeliveryInfo) => {
    const whatsappNumber = '5535998400130';
    
    let message = `🦉 *PEDIDO CORUJÃO LANCHES & AÇAÍ*\n\n`;
    message += `👤 *Cliente:* ${deliveryInfo.name}\n`;
    message += `📍 *Endereço:* ${deliveryInfo.address}, ${deliveryInfo.number}\n`;
    message += `🏘️ *Bairro:* ${deliveryInfo.neighborhood}\n`;
    if (deliveryInfo.reference) {
      message += `📌 *Referência:* ${deliveryInfo.reference}\n`;
    }
    message += `🚚 *Entrega:* ${deliveryInfo.deliveryType === 'delivery' ? 'Delivery' : 'Retirada'}\n`;
    message += `💳 *Pagamento:* ${deliveryInfo.paymentMethod === 'pix' ? 'PIX' : deliveryInfo.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}\n\n`;
    
    message += `🛒 *ITENS DO PEDIDO:*\n`;
    state.items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.name}*\n`;
      message += `   Qtd: ${item.quantity}x | Valor: R$ ${item.price.toFixed(2)}\n`;
      
      if (item.additionals && item.additionals.length > 0) {
        message += `   Adicionais: ${item.additionals.map(add => add.name).join(', ')}\n`;
      }
      
      if (item.acaiDetails) {
        message += `   Tamanho: ${item.acaiDetails.size.size}\n`;
        if (item.acaiDetails.toppings.length > 0) {
          message += `   Misturas: ${item.acaiDetails.toppings.map(t => t.name).join(', ')}\n`;
        }
      }
      
      message += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n💰 *TOTAL GERAL: R$ ${state.total.toFixed(2)}*\n`;
    
    if (deliveryInfo.observations) {
      message += `\n📝 *Observações:* ${deliveryInfo.observations}\n`;
    }
    
    message += `\n🕐 Pedido realizado em: ${new Date().toLocaleString('pt-BR')}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    closeModals();
  };

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      showOrderSummary,
      showDeliveryForm,
      closeModals,
      sendToWhatsApp,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};