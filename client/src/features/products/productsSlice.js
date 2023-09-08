import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api/apiSlice';

const initialState = {
  selectedStyle: {
    style_id: '',
    name: '',
    original_price: '',
    sale_price: null,
    photos: [{
      thumbnail_url: '',
      url: '',
    }],
    skus: {},
  },
  styles: [],
  details: {},
  selectedImage: '',
  expanded: false,
  zoom: false,
  sku: '',
  quantitySelected: 1,
  imageIndex: 0,
  page: 0,
  dark: false,
};

// eslint-disable-next-line default-param-last
// Thanks to immer we can safely mutate state as well
function changeStyle(state = initialState, action) {
  state.selectedStyle = action.payload;
}
function changeImage(state = initialState, action) {
  state.selectedImage = action.payload;
}
function updateState(state = initialState, action) {
  return { ...state, [action.payload.name]: action.payload.value };
}
function toggle(state = initialState, action) {
  return { ...state, [action.payload]: !state[action.payload] };
}
function imageIndex(state = initialState, action) {
  return { ...state, imageIndex: action.payload };
}

const productsSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset: (state) => initialState,
    newSelectedStyle: changeStyle,
    newSelectedImage: changeImage,
    handleStateUpdate: updateState,
    toggleState: toggle,
    newImageIndex: imageIndex,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getProductStyles.matchFulfilled, (state, action) => {
        state.styles = action.payload.results || [];
        state.selectedStyle = state.styles?.length > 0 ? state.styles[0] : {};
        state.selectedImage = state.styles?.length > 0 && state.styles[0].photos?.length > 0 ? state.styles[0].photos[0].url : "https://images.unsplash.com/photo-1421941027568-40ab08ee5592?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80";
      })
      .addMatcher(api.endpoints.getSpecificProduct.matchFulfilled, (state, action) => {
        state.details = action.payload;
      });
  },
});

export const {
  reset,
  newSelectedStyle,
  newSelectedImage,
  handleStateUpdate,
  toggleState,
  newImageIndex,
} = productsSlice.actions;

export default productsSlice.reducer;
