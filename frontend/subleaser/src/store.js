import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './redux/slices/favoritesSlice';

const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
});

export default store;
