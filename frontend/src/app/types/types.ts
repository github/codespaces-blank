export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
  }
  
  export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
  }
  
  export interface Cart {
    id: number;
    items: CartItem[];
    total: number;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }