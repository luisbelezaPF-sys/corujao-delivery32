import { Product, AcaiSize, AcaiTopping, Additional } from './types';

export const products: Product[] = [
  // Hambúrgueres Clássicos
  {
    id: 'x-salada',
    name: 'X-Salada',
    price: 15,
    category: 'hamburger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Alface', 'Tomate', 'Hambúrguer', 'Presunto', 'Muçarela', 'Batata Palha']
  },
  {
    id: 'x-burguer',
    name: 'X-Búrguer',
    price: 15,
    category: 'hamburger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Hambúrguer', 'Muçarela', 'Catupiry']
  },
  {
    id: 'x-bacon',
    name: 'X-Bacon',
    price: 20,
    category: 'hamburger',
    image: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/443f889f-158c-4a37-b80d-dca444eceacb.jpg',
    ingredients: ['Pão', 'Hambúrguer', 'Presunto', 'Muçarela', 'Catupiry', 'Bacon']
  },
  {
    id: 'x-tudo',
    name: 'X-Tudo',
    price: 22,
    category: 'hamburger',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Hambúrguer', 'Presunto', 'Muçarela', 'Alface', 'Tomate', 'Catupiry', 'Milho', 'Ovo', 'Batata Palha']
  },
  {
    id: 'x-calabresa',
    name: 'X-Calabresa',
    price: 22,
    category: 'hamburger',
    image: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/b6d3232b-18a8-4cb4-bfb1-f81273960492.jpg',
    ingredients: ['Pão', 'Hambúrguer', 'Calabresa', 'Alface', 'Tomate', 'Presunto', 'Muçarela', 'Catupiry', 'Batata Palha']
  },
  {
    id: 'x-corujao',
    name: 'X-Corujão',
    price: 27,
    category: 'hamburger',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Hambúrguer', 'Lombo', 'Calabresa', 'Bacon', 'Presunto', 'Muçarela', 'Alface', 'Tomate', 'Catupiry', 'Ovo', 'Milho', 'Batata Palha']
  },

  // Lanches Especiais
  {
    id: 'x-bacon-salada-egg',
    name: 'X-Bacon Salada Egg',
    price: 22,
    category: 'special',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Hambúrguer', 'Presunto', 'Muçarela', 'Catupiry', 'Bacon', 'Ovo', 'Tomate', 'Alface']
  },

  // Lanches com Frango
  {
    id: 'frango-simples',
    name: 'Frango Simples',
    price: 20,
    category: 'chicken',
    image: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/19afb386-dce3-47f0-bd8d-a12e1885da72.jpg',
    ingredients: ['Pão', 'Catupiry', 'Presunto', 'Muçarela', 'Frango']
  },
  {
    id: 'frango-moda-casa',
    name: 'À Moda da Casa de Frango',
    price: 27,
    category: 'chicken',
    image: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/31be00b0-bd45-4cb9-a2df-f1420252634a.jpg',
    ingredients: ['Pão', 'Frango', 'Alface', 'Tomate', 'Bacon', 'Ovo', 'Catupiry', 'Milho', 'Batata Palha']
  },
  {
    id: 'x-frango',
    name: 'X-Frango',
    price: 30,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Hambúrguer', 'Frango', 'Catupiry', 'Milho', 'Alface', 'Tomate', 'Bacon', 'Presunto', 'Muçarela', 'Batata Palha']
  },

  // Lanches de Lombo
  {
    id: 'lombo-moda-casa',
    name: 'À Moda da Casa de Lombo',
    price: 30,
    category: 'pork',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Lombo', 'Alface', 'Tomate', 'Bacon', 'Ovo', 'Catupiry', 'Milho', 'Presunto', 'Muçarela', 'Batata Palha']
  },

  // Lanches Simples
  {
    id: 'misto-quente',
    name: 'Misto Quente',
    price: 14,
    category: 'simple',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Presunto', 'Muçarela', 'Catupiry']
  },
  {
    id: 'americano',
    name: 'Americano',
    price: 15,
    category: 'simple',
    image: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/79972192-fcae-48fb-98a6-3874c430140b.jpg',
    ingredients: ['Pão', 'Presunto', 'Muçarela', 'Catupiry', 'Tomate', 'Alface', 'Ovo']
  },
  {
    id: 'vegetariano',
    name: 'Vegetariano',
    price: 20,
    category: 'simple',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    ingredients: ['Pão', 'Muçarela 2x (Duas)', '2 Ovos', 'Alface', 'Tomate', 'Milho', 'Batata Palha', 'Catupiry']
  }
];

export const acaiSizes: AcaiSize[] = [
  { size: '300ml', price: 9 },
  { size: '400ml', price: 11 },
  { size: '500ml', price: 13 },
  { size: '700ml', price: 15 }
];

export const acaiToppings: AcaiTopping[] = [
  { name: 'Chantilly', price: 2.50 },
  { name: 'Leite em pó', price: 2.00 },
  { name: 'Leite Ninho', price: 2.50 },
  { name: 'Leite condensado', price: 2.50 },
  { name: 'Confete', price: 2.00 },
  { name: 'Ovomaltine', price: 3.00 },
  { name: 'Paçoca', price: 2.00 },
  { name: 'Bis preto', price: 2.00 },
  { name: 'Bis branco', price: 2.00 },
  { name: 'Nutella', price: 7.00 },
  { name: 'Trento preto', price: 4.00 },
  { name: 'Trento branco', price: 4.00 },
  { name: 'Sonho de Valsa', price: 3.00 },
  { name: 'Iogurte', price: 3.00 },
  { name: 'Granola', price: 2.00 },
  { name: 'Kit Kat', price: 5.00 },
  { name: 'Mousse de Morango', price: 2.50 },
  { name: 'Mousse de Maracujá', price: 2.50 },
  { name: 'Cobertura de Morango', price: 2.00 },
  { name: 'Cobertura de Chocolate', price: 2.00 },
  { name: 'Suflair', price: 8.00 },
  { name: 'Laka', price: 4.00 }
];

export const additionals: Additional[] = [
  { name: 'Catupiry', price: 2 },
  { name: 'Cheddar', price: 3 },
  { name: 'Presunto', price: 2 },
  { name: 'Muçarela', price: 2 },
  { name: 'Ovo', price: 2 },
  { name: 'Batata Palha', price: 2 },
  { name: 'Bacon', price: 6 },
  { name: 'Lombo', price: 6 },
  { name: 'Frango', price: 6 },
  { name: 'Calabresa', price: 6 },
  { name: 'Maionese', price: 1 }
];

export const categoryNames = {
  hamburger: 'Hambúrgueres Clássicos',
  special: 'Lanches Especiais',
  chicken: 'Lanches com Frango',
  pork: 'Lanches de Lombo',
  simple: 'Lanches Simples'
};