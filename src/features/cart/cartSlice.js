import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import cartItems from '../../cartItems';
import axios from 'axios';

/**testing purposes. modal reducer is not present in this slice
 * but thunkAPI was used to access it
 */
import { openModal } from '../modal/modalSlice';

const url = 'https://coursee-api.com/react-useReducer-cart-project';

const initialState = {
  //initially grabbed items from cartItems// now fetching it dynamically
  //from an api. useEffect will execute the getCartItems function
  //then set the cartItems empty array to the axios result .
  //then set isloading to false . this is all done in the extraReducers if fufilled
  cartItems: [] /**cartItems */,
  amount: 1,
  total: 0,
  isLoading: true,
};

// export const getCartItems = createAsyncThunk('cart/getCartItems', () => {
//   return fetch(url)
//     .then((resp) => {
//       resp.json();
//       console.log(resp.json());
//     })
//     .catch((err) => console.log(err));
// });
export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  async (name, thunkAPI) => {
    //argument passed in the component calling this function can
    //be assessed in async's parameterthrough createAyncThunk.
    try {
      // console.log(name);
      // console.log(thunkAPI);
      // console.log(thunkAPI.getState());
      /**thunkAPI can be used to access features or reducers not in this slice
       * dispatch to execute them
       */
      // thunkAPI.dispatch(openModal());
      const resp = await axios(url);
      return resp.data;
    } catch (error) {
      console.log(error);
      /**error will message will hardcoded into payload inside action
       * ie action.payload
       */
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);

//actions contain reducers
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
      // payload set to whatever argument passed into the function inside the dispatch
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;

//action.payload will contain the json file if
//fetch is successful
// state.cartItems = action.payload;
