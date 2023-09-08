import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '../api/apiSlice';

const initialState = {
  related: [],
  relatedIndex: 0,
  outfitIndex: 0,
  modalOpen: false,
  relatedProductFeatures: [],
  relatedProductName: null,
  currentProductName: null,
  combinedProductFeatures: [],
  outfitList: [],
};

function moveRelatedCarousel(state = initialState, action) {
  state.relatedIndex = action.payload;
}
function moveOutfitCarousel(state = initialState, action) {
  state.outfitIndex = action.payload;
}
function toggleModal(state = initialState, action) {
  const toggle = (input) => !input;
  state.modalOpen = toggle(state.modalOpen);
}
function setRelatedProductFeatures(state = initialState, action) {
  state.relatedProductFeatures = action.payload;
}
function setRelatedProductName(state = initialState, action) {
  state.relatedProductName = action.payload;
}
function setCurrentProductName(state = initialState, action) {
  state.currentProductName = action.payload;
}
function setOutfitList(state = initialState, action) {
  state.outfitList = Object.values({ ...localStorage }).map((item) => JSON.parse(item));
}
function addToOutfit(state = initialState, action) {
  if (!JSON.parse(localStorage.getItem(action.payload.details.id))) {
    localStorage.setItem(action.payload.details.id, JSON.stringify(action.payload));
    state.outfitList.unshift(action.payload);
    toast.success(`${action.payload.details.name} has been added to Your Outfit 😎`);
  } else {
    toast.error(`${action.payload.details.name} is already in Your Outfit ⛔`);
  }
}
function removeFromOutfit(state = initialState, action) {
  localStorage.removeItem(action.payload.details.id);
  const index = state.outfitList.indexOf(action.payload);
  if (index > -1) {
    state.outfitList.splice(index, 1);
  }
  toast.error(`${action.payload.details.name} has been removed from Your Outfit 💔`);
}

function generateCombinedProductFeatures(state = initialState, action) {
  const combinedData = [];
  const relatedProductDetails = state.relatedProductFeatures;
  const currentProductDetails = action.payload;
  relatedProductDetails.forEach((char) => {
    const description = char.value ? `${char.feature}: ${char.value}` : char.feature;
    combinedData.push({ value: description, related: true, current: false });
  });
  currentProductDetails.forEach((char) => {
    const description = char.value ? `${char.feature}: ${char.value}` : char.feature;
    let hasCharacteristic = false;
    combinedData.forEach((existingChar) => {
      if (existingChar.value === description) {
        existingChar.current = true;
        hasCharacteristic = true;
      }
    });
    if (!hasCharacteristic) {
      combinedData.push({ value: description, related: false, current: true });
    }
  });
  state.combinedProductFeatures = combinedData;
}

const relatedSlice = createSlice({
  name: 'related',
  initialState,
  reducers: {
    reset: (state) => initialState,
    newRelatedCarouselIndex: moveRelatedCarousel,
    newOutfitCarouselIndex: moveOutfitCarousel,
    newModalState: toggleModal,
    newRelatedProductFeatures: setRelatedProductFeatures,
    generateProductFeatures: generateCombinedProductFeatures,
    newRelatedProductName: setRelatedProductName,
    newCurrentProductName: setCurrentProductName,
    newOutfitList: setOutfitList,
    newAddToOutfit: addToOutfit,
    newRemoveFromOutfit: removeFromOutfit,

  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getRelatedProductInfo.matchFulfilled, (state, action) => {
        state.related = action.payload;
      });
  },
});

export const {
  reset,
  newRelatedCarouselIndex,
  newOutfitCarouselIndex,
  newModalState,
  newRelatedProductFeatures,
  generateProductFeatures,
  newRelatedProductName,
  newCurrentProductName,
  newOutfitList,
  newAddToOutfit,
  newRemoveFromOutfit,
} = relatedSlice.actions;

export default relatedSlice.reducer;
