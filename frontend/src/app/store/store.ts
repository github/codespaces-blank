import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Ensure this file exists and is correctly implemented
import productReducer from './slices/productSlice'; // Ensure this file exists and is correctly implemented
import cartReducer from './slices/cartSlice'; // Ensure this file exists and is correctly implemented

// Configure the Redux store with the reducers
export const store = configureStore({
  reducer: {
    auth: authReducer, // Handles authentication-related state
    products: productReducer, // Handles product-related state
    cart: cartReducer, // Handles cart-related state
  },
});

// Infer the `RootState` type from the store's state
export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type from the store's dispatch function
export type AppDispatch = typeof store.dispatch;