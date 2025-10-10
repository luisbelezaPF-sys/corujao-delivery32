'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, MessageCircle, Instagram, Utensils, Coffee, Settings, Printer, FileText, LogOut, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/lib/cart-context';
import { products, acaiSizes, acaiToppings, additionals, categoryNames } from '@/lib/data';
import { Product, AcaiSize, AcaiTopping, Additional, DeliveryInfo } from '@/lib/types';

// Componente de Login Admin
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'bruno2425') {
      onLogin();
      setError('');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 border border-purple-500/20">
        <div className="text-center mb-8">
          <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
          <p className="text-gray-400">Acesso restrito</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-white">Usuário</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border-purple-500/20 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-purple-500/20 text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

// Componente do Painel Admin
const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const generateFiscalCoupon = (order: any) => {
    const couponData = {
      numero: Math.floor(Math.random() * 100000),
      data: new Date().toLocaleString('pt-BR'),
      cliente: order.customerInfo?.name || 'Cliente',
      items: order.items,
      total: order.total,
      pagamento: order.customerInfo?.paymentMethod || 'PIX',
      endereco: order.customerInfo?.address || 'Retirada'
    };

    // Gerar cupom fiscal
    const couponContent = `
═══════════════════════════════════════
        CORUJÃO LANCHES & AÇAÍ
═══════════════════════════════════════
CNPJ: 00.000.000/0001-00
Endereço: Rua Principal, 123
Telefone: (35) 99840-0130
═══════════════════════════════════════
CUPOM FISCAL Nº: ${couponData.numero}
Data: ${couponData.data}
Cliente: ${couponData.cliente}
═══════════════════════════════════════
ITENS:
${couponData.items.map((item: any) => 
  `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
).join('\n')}
═══════════════════════════════════════
TOTAL: R$ ${couponData.total.toFixed(2)}
PAGAMENTO: ${couponData.pagamento}
${couponData.endereco !== 'Retirada' ? `ENTREGA: ${couponData.endereco}` : 'RETIRADA NO LOCAL'}
═══════════════════════════════════════
        Obrigado pela preferência!
═══════════════════════════════════════
    `;

    // Imprimir automaticamente
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cupom Fiscal - ${couponData.numero}</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                margin: 0; 
                padding: 20px;
                white-space: pre-line;
              }
              @media print {
                body { margin: 0; padding: 10px; }
              }
            </style>
          </head>
          <body>${couponContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    return couponData;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header do Admin */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
                  <p className="text-gray-400">Bem-vindo, Bruno</p>
                </div>
              </div>
              <Button 
                onClick={onLogout}
                variant="outline"
                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* Simulação de Pedidos */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Pedidos Recentes
            </h2>

            {/* Pedidos de Exemplo */}
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  numero: '#001',
                  cliente: 'João Silva',
                  total: 45.90,
                  status: 'Pendente',
                  items: [
                    { name: 'X-Bacon', quantity: 1, price: 25.90 },
                    { name: 'Açaí 500ml', quantity: 1, price: 20.00 }
                  ],
                  customerInfo: {
                    name: 'João Silva',
                    address: 'Rua das Flores, 123',
                    paymentMethod: 'PIX'
                  }
                },
                {
                  id: 2,
                  numero: '#002',
                  cliente: 'Maria Santos',
                  total: 32.50,
                  status: 'Preparando',
                  items: [
                    { name: 'X-Salada', quantity: 1, price: 22.50 },
                    { name: 'Refrigerante', quantity: 1, price: 10.00 }
                  ],
                  customerInfo: {
                    name: 'Maria Santos',
                    address: 'Av. Principal, 456',
                    paymentMethod: 'Cartão'
                  }
                }
              ].map((order) => (
                <div key={order.id} className="bg-gray-800 rounded-lg p-4 border border-purple-500/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400 font-bold">{order.numero}</span>
                      <span className="text-white font-semibold">{order.cliente}</span>
                      <Badge className={`${
                        order.status === 'Pendente' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'Preparando' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-purple-400">
                        R$ {order.total.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => generateFiscalCoupon(order)}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        size="sm"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Gerar Cupom
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <p className="mb-1">Itens: {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</p>
                    <p>Endereço: {order.customerInfo.address}</p>
                    <p>Pagamento: {order.customerInfo.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Instruções */}
            <div className="mt-8 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h3 className="text-white font-semibold mb-2">📋 Instruções:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Clique em "Gerar Cupom" para criar e imprimir o cupom fiscal automaticamente</li>
                <li>• O cupom será aberto em nova janela e enviado para impressão</li>
                <li>• Todos os dados do pedido são incluídos no cupom fiscal</li>
                <li>• O sistema gera numeração automática para cada cupom</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente do Carrinho Flutuante
const FloatingCart = () => {
  const { state, toggleCart, removeFromCart, updateQuantity, showOrderSummary } = useCart();

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-gray-900 w-full max-w-md h-full overflow-y-auto border-l border-purple-500/20">
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
              Seu Pedido
            </h2>
            <Button variant="ghost" size="sm" onClick={toggleCart} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-purple-500/10">
                    <div className="flex items-start gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                        <p className="text-purple-400 font-bold">R$ {item.price.toFixed(2)}</p>
                        
                        {item.additionals && item.additionals.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            + {item.additionals.map(add => add.name).join(', ')}
                          </p>
                        )}
                        
                        {item.acaiDetails && (
                          <div className="text-xs text-gray-400 mt-1">
                            <p>Tamanho: {item.acaiDetails.size.size}</p>
                            {item.acaiDetails.toppings.length > 0 && (
                              <p>Misturas: {item.acaiDetails.toppings.map(t => t.name).join(', ')}</p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 p-0 border-purple-500/20 hover:border-purple-400"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0 border-purple-500/20 hover:border-purple-400"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-purple-500/20 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold text-purple-400">R$ {state.total.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={showOrderSummary}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
                >
                  Finalizar Pedido
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de Resumo do Pedido
const OrderSummary = () => {
  const { state, showDeliveryForm, closeModals } = useCart();

  if (!state.showOrderSummary) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Resumo do Pedido</h2>
            <Button variant="ghost" size="sm" onClick={closeModals} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            {state.items.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-purple-500/10">
                <div className="flex items-start gap-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-purple-400 font-bold">R$ {item.price.toFixed(2)} x {item.quantity}</p>
                    
                    {item.additionals && item.additionals.length > 0 && (
                      <p className="text-sm text-gray-400 mt-1">
                        Adicionais: {item.additionals.map(add => add.name).join(', ')}
                      </p>
                    )}
                    
                    {item.acaiDetails && (
                      <div className="text-sm text-gray-400 mt-1">
                        <p>Tamanho: {item.acaiDetails.size.size}</p>
                        {item.acaiDetails.toppings.length > 0 && (
                          <p>Misturas: {item.acaiDetails.toppings.map(t => t.name).join(', ')}</p>
                        )}
                      </div>
                    )}

                    <p className="text-right text-white font-semibold mt-2">
                      Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-purple-500/20 pt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-white">Total Geral:</span>
              <span className="text-3xl font-bold text-purple-400">R$ {state.total.toFixed(2)}</span>
            </div>
            <Button 
              onClick={showDeliveryForm}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
            >
              Confirmar Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente do Formulário de Entrega
const DeliveryForm = () => {
  const { state, closeModals, sendToWhatsApp } = useCart();
  const [formData, setFormData] = useState<DeliveryInfo>({
    name: '',
    address: '',
    number: '',
    neighborhood: '',
    reference: '',
    deliveryType: 'delivery',
    paymentMethod: 'pix',
    observations: ''
  });

  if (!state.showDeliveryForm) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendToWhatsApp(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Dados para Entrega</h2>
            <Button variant="ghost" size="sm" onClick={closeModals} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="bg-gray-800 border-purple-500/20 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address" className="text-white">Endereço *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                className="bg-gray-800 border-purple-500/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="number" className="text-white">Número *</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                required
                className="bg-gray-800 border-purple-500/20 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood" className="text-white">Bairro *</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                required
                className="bg-gray-800 border-purple-500/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="reference" className="text-white">Ponto de Referência</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                className="bg-gray-800 border-purple-500/20 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deliveryType" className="text-white">Tipo de Entrega *</Label>
              <Select value={formData.deliveryType} onValueChange={(value: 'delivery' | 'pickup') => setFormData({...formData, deliveryType: value})}>
                <SelectTrigger className="bg-gray-800 border-purple-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="pickup">Retirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentMethod" className="text-white">Forma de Pagamento *</Label>
              <Select value={formData.paymentMethod} onValueChange={(value: 'pix' | 'card' | 'cash') => setFormData({...formData, paymentMethod: value})}>
                <SelectTrigger className="bg-gray-800 border-purple-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="observations" className="text-white">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData({...formData, observations: e.target.value})}
              className="bg-gray-800 border-purple-500/20 text-white"
              rows={3}
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar Pedido via WhatsApp
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente do Construtor de Açaí
const AcaiBuilder = () => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<AcaiSize | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<AcaiTopping[]>([]);

  const toggleTopping = (topping: AcaiTopping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.name === topping.name);
      if (exists) {
        return prev.filter(t => t.name !== topping.name);
      } else {
        return [...prev, topping];
      }
    });
  };

  const getTotalPrice = () => {
    if (!selectedSize) return 0;
    return selectedSize.price + selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const acaiItem = {
      type: 'acai' as const,
      name: `Açaí ${selectedSize.size}`,
      price: getTotalPrice(),
      quantity: 1,
      acaiDetails: {
        id: Date.now().toString(),
        size: selectedSize,
        toppings: selectedToppings,
        totalPrice: getTotalPrice()
      },
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop'
    };

    addToCart(acaiItem);
    setSelectedSize(null);
    setSelectedToppings([]);
  };

  return (
    <section id="acai" className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">🍧 Monte seu Açaí</h2>
          <p className="text-gray-300 text-lg">Escolha o tamanho e suas misturas favoritas</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-8 border border-purple-500/20">
            {/* Seleção de Tamanho */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">1. Escolha o Tamanho</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {acaiSizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSize?.size === size.size
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🥤</div>
                      <div className="text-white font-semibold">{size.size}</div>
                      <div className="text-purple-400 font-bold">R$ {size.price.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Misturas */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">2. Escolha suas Misturas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {acaiToppings.map((topping) => (
                  <button
                    key={topping.name}
                    onClick={() => toggleTopping(topping)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      selectedToppings.find(t => t.name === topping.name)
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-white font-medium text-sm">{topping.name}</div>
                    <div className="text-purple-400 font-bold text-sm">+R$ {topping.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo e Adicionar */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  {selectedSize && (
                    <div className="text-white">
                      <p className="font-semibold">Açaí {selectedSize.size}</p>
                      {selectedToppings.length > 0 && (
                        <p className="text-sm text-gray-400">
                          + {selectedToppings.map(t => t.name).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      R$ {getTotalPrice().toFixed(2)}
                    </div>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente do Card de Produto
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [selectedAdditionals, setSelectedAdditionals] = useState<Additional[]>([]);
  const [showAdditionals, setShowAdditionals] = useState(false);

  const toggleAdditional = (additional: Additional) => {
    setSelectedAdditionals(prev => {
      const exists = prev.find(a => a.name === additional.name);
      if (exists) {
        return prev.filter(a => a.name !== additional.name);
      } else {
        return [...prev, additional];
      }
    });
  };

  const getTotalPrice = () => {
    return product.price + selectedAdditionals.reduce((sum, add) => sum + add.price, 0);
  };

  const handleAddToCart = () => {
    const item = {
      type: 'product' as const,
      name: product.name,
      price: getTotalPrice(),
      quantity: 1,
      additionals: selectedAdditionals,
      image: product.image
    };

    addToCart(item);
    setSelectedAdditionals([]);
    setShowAdditionals(false);
  };

  return (
    <Card className="bg-gray-800 border-purple-500/20 overflow-hidden hover:border-purple-400/40 transition-all group">
      <div className="relative">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-sm">Sem imagem</p>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
        {product.ingredients && (
          <p className="text-gray-400 text-sm mb-3">
            {product.ingredients.join(', ')}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-purple-400">R$ {product.price.toFixed(2)}</span>
        </div>

        {!showAdditionals ? (
          <Button 
            onClick={() => setShowAdditionals(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-3">Adicionais:</h4>
              <div className="grid grid-cols-2 gap-2">
                {additionals.map((additional) => (
                  <button
                    key={additional.name}
                    onClick={() => toggleAdditional(additional)}
                    className={`p-2 rounded text-xs border transition-all ${
                      selectedAdditionals.find(a => a.name === additional.name)
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <div>{additional.name}</div>
                    <div className="text-purple-400">+R$ {additional.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">Total:</span>
                <span className="text-xl font-bold text-purple-400">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdditionals(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:border-purple-400"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente Principal
export default function CorujaoDelivery() {
  const { state, toggleCart } = useCart();
  const [currentSection, setCurrentSection] = useState('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/657fa415-837f-4b3d-b512-5a68910ebf03.png" 
                alt="Corujão Lanches & Açaí" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-white">Corujão Lanches & Açaí</h1>
                <p className="text-xs text-purple-400">Delivery Premium</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Botão Admin */}
              <button
                onClick={() => setShowAdminLogin(true)}
                className="text-gray-400 hover:text-purple-400 transition-colors"
                title="Painel Admin"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Ícones Sociais */}
              <a href="https://wa.me/5535998400130" target="_blank" rel="noopener noreferrer" 
                 className="text-green-400 hover:text-green-300 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/corujao2448" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              
              {/* Carrinho */}
              <button 
                onClick={toggleCart}
                className="relative bg-purple-600 hover:bg-purple-700 p-3 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {state.items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/657fa415-837f-4b3d-b512-5a68910ebf03.png" 
                alt="Corujão Lanches & Açaí" 
                className="h-96 w-auto mx-auto"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              Corujão Lanches & Açaí
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
              Seu apetite nunca mais será o mesmo na madrugada!
            </p>
            <Button 
              onClick={() => scrollToSection('menu')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 text-lg rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <Utensils className="w-6 h-6 mr-3" />
              Fazer Pedido Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Seção Preta entre "Fazer Pedido" e Menu */}
      <div className="bg-black py-4">
        <div className="container mx-auto px-4">
          <div className="h-8"></div>
        </div>
      </div>

      {/* Navegação do Menu */}
      <nav className="sticky top-20 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-4 overflow-x-auto">
            <button 
              onClick={() => scrollToSection('acai')}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold whitespace-nowrap"
            >
              <Coffee className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold whitespace-nowrap"
            >
              <Utensils className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Seção de Açaí */}
      <AcaiBuilder />

      {/* Menu de Lanches */}
      <section id="menu" className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">🍔 Nosso Cardápio</h2>
            <p className="text-gray-300 text-lg">Lanches artesanais feitos com muito carinho</p>
          </div>

          {Object.entries(categoryNames).map(([category, name]) => {
            const categoryProducts = products.filter(p => p.category === category);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">{name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => {
                    return <ProductCard key={product.id} product={product} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-purple-500/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/657fa415-837f-4b3d-b512-5a68910ebf03.png" 
              alt="Corujão Lanches & Açaí" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <p className="text-xl text-yellow-400 font-semibold mb-4">
            Corujão Lanches — Seu apetite nunca mais será o mesmo na madrugada!
          </p>
          <div className="flex items-center justify-center gap-6">
            <a href="https://wa.me/5535998400130" target="_blank" rel="noopener noreferrer" 
               className="text-green-400 hover:text-green-300 transition-colors">
              <MessageCircle className="w-8 h-8" />
            </a>
            <a href="https://instagram.com/corujao2448" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors">
              <Instagram className="w-8 h-8" />
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            © 2024 Corujão Lanches & Açaí - Todos os direitos reservados
          </p>
        </div>
      </footer>

      {/* Componentes Modais */}
      <FloatingCart />
      <OrderSummary />
      <DeliveryForm />

      {/* Login e Painel Admin */}
      {showAdminLogin && !isAdminLoggedIn && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}
      {isAdminLoggedIn && (
        <AdminPanel onLogout={handleAdminLogout} />
      )}
    </div>
  );
}