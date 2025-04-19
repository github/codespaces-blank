import api from '../utils/axiosConfig';
import { Product } from '../types/types';

export const getProducts = async (params = {}): Promise<Product[]> => {
  const response = await api.get<Product[]>('ecommerce/products/', { params });
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`ecommerce/products/${id}/`);
  return response.data;
};