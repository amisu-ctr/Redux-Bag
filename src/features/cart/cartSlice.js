import { createSlice } from '@reduxjs/toolkit';
import cartItems from '../../cartItems';

const initialState = {
  cartItems: cartItems,
  amount: 1,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    //available in actions
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      console.log(action);
      const itemId = action.payload; //payload is just a unique id
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
  },
});

// console.log(cartSlice);
export const { clearCart, removeItem } = cartSlice.actions;

export default cartSlice.reducer;
