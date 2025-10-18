'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, MessageCircle, Instagram, Utensils, Coffee, Settings, Printer, FileText, LogOut, Eye, EyeOff, Package, BarChart3, Edit, Trash2, Save, Upload, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/lib/cart-context';
import { products as initialProducts, acaiSizes, acaiToppings, additionals, categoryNames } from '@/lib/data';
import { Product, AcaiSize, AcaiTopping, Additional, DeliveryInfo } from '@/lib/types';

// Tipos para o sistema de pedidos
interface Order {
  id: string;
  numero: string;
  cliente: string;
  total: number;
  status: 'em preparo' | 'saiu para entrega' | 'entregue' | 'cancelado';
  items: any[];
  customerInfo: {
    name: string;
    address: string;
    paymentMethod: string;
    phone?: string;
  };
  createdAt: Date;
}

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
      <div className="bg-white rounded-2xl max-w-md w-full p-8 border border-purple-200 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Painel Administrativo</h2>
          <p className="text-gray-600">Canto do Açaí - Acesso restrito</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-gray-700 font-medium">Usuário</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>
          )}

          <Button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5"
          >
            Entrar no Painel
          </Button>
        </form>
      </div>
    </div>
  );
};

// Componente do Painel Admin
const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      numero: '#001',
      cliente: 'João Silva',
      total: 45.90,
      status: 'em preparo',
      items: [
        { name: 'X-Bacon', quantity: 1, price: 25.90 },
        { name: 'Açaí 500ml', quantity: 1, price: 20.00 }
      ],
      customerInfo: {
        name: 'João Silva',
        address: 'Rua das Flores, 123',
        paymentMethod: 'PIX',
        phone: '(35) 99999-9999'
      },
      createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutos atrás
    },
    {
      id: '2',
      numero: '#002',
      cliente: 'Maria Santos',
      total: 32.50,
      status: 'saiu para entrega',
      items: [
        { name: 'X-Salada', quantity: 1, price: 22.50 },
        { name: 'Refrigerante', quantity: 1, price: 10.00 }
      ],
      customerInfo: {
        name: 'Maria Santos',
        address: 'Av. Principal, 456',
        paymentMethod: 'Cartão',
        phone: '(35) 98888-8888'
      },
      createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutos atrás
    }
  ]);

  // Função para gerar cupom fiscal
  const generateFiscalCoupon = (order: Order) => {
    const couponData = {
      numero: Math.floor(Math.random() * 100000),
      data: new Date().toLocaleString('pt-BR'),
      cliente: order.customerInfo.name,
      items: order.items,
      total: order.total,
      pagamento: order.customerInfo.paymentMethod,
      endereco: order.customerInfo.address
    };

    // Criar conteúdo do cupom otimizado para papel térmico 80mm
    const couponContent = `
      <div style="width: 80mm; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.2; margin: 0; padding: 5mm;">
        <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px;">
          <div style="font-size: 16px; font-weight: bold;">CANTO DO AÇAÍ</div>
          <div style="font-size: 10px;">CNPJ: 00.000.000/0001-00</div>
          <div style="font-size: 10px;">Endereço: Rua Principal, 123</div>
          <div style="font-size: 10px;">Tel: (35) 99840-0130</div>
        </div>
        
        <div style="margin: 10px 0; text-align: center;">
          <div style="font-weight: bold;">CUPOM FISCAL Nº: ${couponData.numero}</div>
          <div style="font-size: 10px;">${couponData.data}</div>
        </div>
        
        <div style="margin: 10px 0;">
          <div><strong>Cliente:</strong> ${couponData.cliente}</div>
          <div style="font-size: 10px;"><strong>Endereço:</strong> ${couponData.endereco}</div>
        </div>
        
        <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; margin: 10px 0;">
          <div style="font-weight: bold; margin-bottom: 5px;">ITENS DO PEDIDO:</div>
          ${couponData.items.map((item: any, index: number) => `
            <div style="margin: 2px 0; display: flex; justify-content: space-between;">
              <span>${index + 1}. ${item.name} (${item.quantity}x)</span>
              <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        
        <div style="margin: 10px 0; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>TOTAL:</span>
            <span>R$ ${couponData.total.toFixed(2)}</span>
          </div>
          <div style="margin-top: 5px;">
            <strong>Pagamento:</strong> ${couponData.pagamento}
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px;">
          <div style="font-size: 12px; font-weight: bold;">Obrigado pela preferência!</div>
          <div style="font-size: 10px; margin-top: 5px;">Volte sempre! 😊</div>
        </div>
      </div>
    `;

    // Abrir janela de impressão
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cupom Fiscal - ${couponData.numero}</title>
            <style>
              @page { 
                size: 80mm auto; 
                margin: 0; 
              }
              body { 
                margin: 0; 
                padding: 0;
                font-family: 'Courier New', monospace;
              }
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            ${couponContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Imprimir automaticamente após carregar
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }

    return couponData;
  };

  // Função para atualizar status do pedido
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Função para calcular tempo desde o pedido
  const getTimeSinceOrder = (createdAt: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'em preparo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'saiu para entrega': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'entregue': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Componente de Gerenciamento de Produtos
  const ProductManagement = () => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
      name: '',
      price: 0,
      category: 'hamburger',
      image: '',
      ingredients: []
    });
    const [showAddForm, setShowAddForm] = useState(false);

    const handleSaveProduct = (product: Product) => {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      setEditingProduct(null);
    };

    const handleDeleteProduct = (productId: string) => {
      if (confirm('Tem certeza que deseja remover este produto?')) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    };

    const handleAddProduct = () => {
      if (newProduct.name && newProduct.price) {
        const product: Product = {
          id: Date.now().toString(),
          name: newProduct.name,
          price: newProduct.price,
          category: newProduct.category || 'hamburger',
          image: newProduct.image || '',
          ingredients: newProduct.ingredients || []
        };
        setProducts(prev => [...prev, product]);
        setNewProduct({ name: '', price: 0, category: 'hamburger', image: '', ingredients: [] });
        setShowAddForm(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Gerenciar Produtos</h3>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-purple-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Novo Produto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Nome do Produto</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Categoria</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryNames).map(([key, name]) => (
                        <SelectItem key={key} value={key}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700">URL da Imagem</Label>
                  <Input
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="mt-1"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="border-gray-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-4">
                {editingProduct?.id === product.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="font-semibold"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    />
                    <Input
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                      placeholder="URL da imagem"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveProduct(editingProduct)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Salvar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-3" />
                    )}
                    <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
                    <p className="text-purple-600 font-bold mb-2">R$ {product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mb-3">{categoryNames[product.category as keyof typeof categoryNames]}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingProduct(product)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header do Painel */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Canto do Açaí</h1>
                  <p className="text-gray-600">Painel Administrativo</p>
                </div>
              </div>
              <Button 
                onClick={onLogout}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Menu Lateral */}
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <nav className="p-4 space-y-2">
              {[
                { id: 'pedidos', label: 'Pedidos', icon: FileText },
                { id: 'produtos', label: 'Produtos', icon: Package },
                { id: 'impressao', label: 'Impressão', icon: Printer },
                { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
                { id: 'configuracoes', label: 'Configurações', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 p-6">
            {activeTab === 'pedidos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Gestão de Pedidos</h2>
                  <div className="flex gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {orders.filter(o => o.status === 'em preparo').length} Em Preparo
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {orders.filter(o => o.status === 'saiu para entrega').length} Saiu para Entrega
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">{order.numero}</h3>
                              <p className="text-gray-600">{order.cliente}</p>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} border`}>
                              {order.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Clock className="w-4 h-4" />
                              {getTimeSinceOrder(order.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">R$ {order.total.toFixed(2)}</p>
                            <Button
                              onClick={() => generateFiscalCoupon(order)}
                              className="bg-green-600 hover:bg-green-700 text-white mt-2"
                              size="sm"
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Imprimir Cupom
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Itens do Pedido:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.quantity}x {item.name} - R$ {(item.price * item.quantity).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Informações:</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Endereço:</strong> {order.customerInfo.address}</p>
                              <p><strong>Pagamento:</strong> {order.customerInfo.paymentMethod}</p>
                              {order.customerInfo.phone && (
                                <p><strong>Telefone:</strong> {order.customerInfo.phone}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="em preparo">Em Preparo</SelectItem>
                              <SelectItem value="saiu para entrega">Saiu para Entrega</SelectItem>
                              <SelectItem value="entregue">Entregue</SelectItem>
                              <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'produtos' && <ProductManagement />}

            {activeTab === 'impressao' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Central de Impressão</h2>
                <Card className="border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Configurações de Impressão</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">📋 Instruções de Impressão:</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Cupons são otimizados para papel térmico de 80mm</li>
                          <li>• Impressão automática após gerar cupom</li>
                          <li>• Use o botão "Imprimir Cupom" em cada pedido</li>
                          <li>• Numeração automática para controle fiscal</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2">✅ Sistema Configurado:</h4>
                        <p className="text-green-700 text-sm">
                          O sistema está configurado para imprimir cupons fiscais automaticamente 
                          usando window.print() do navegador, otimizado para papel térmico 80mm.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'relatorios' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-purple-200">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BarChart3 className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Vendas Hoje</h3>
                      <p className="text-2xl font-bold text-green-600">R$ 78,40</p>
                      <p className="text-sm text-gray-600">2 pedidos</p>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Produtos</h3>
                      <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                      <p className="text-sm text-gray-600">cadastrados</p>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Pedidos</h3>
                      <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
                      <p className="text-sm text-gray-600">total</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'configuracoes' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
                <Card className="border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Informações da Loja</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700">Nome da Loja</Label>
                        <Input value="Canto do Açaí" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-gray-700">CNPJ</Label>
                        <Input value="00.000.000/0001-00" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-gray-700">Endereço</Label>
                        <Input value="Rua Principal, 123" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-gray-700">Telefone</Label>
                        <Input value="(35) 99840-0130" className="mt-1" />
                      </div>
                    </div>
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                      Salvar Configurações
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
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
            const categoryProducts = initialProducts.filter(p => p.category === category);
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