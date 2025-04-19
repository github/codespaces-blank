import api from '../utils/axiosConfig';
import { Cart, CartItem } from '../types/types';

export const getCart = async (): Promise<Cart> => {
  const response = await api.get<Cart>('ecommerce/cart/');
  return response.data;
};

export const addToCart = async (productId: number, quantity = 1): Promise<CartItem> => {
  const response = await api.post<CartItem>('ecommerce/cart/add/', { product_id: productId, quantity });
  return response.data;
};

export const removeFromCart = async (itemId: number): Promise<void> => {
  await api.delete(`ecommerce/cart/items/${itemId}/`);
};