import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice'; // Adjust the path as needed
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/types'; // Adjust the path as needed

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const authInitialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

const productInitialState = {
  products: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState: productInitialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    products: productSlice.reducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;