import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import thunk from 'redux-thunk';

// Import your reducers
import valuationReducer from './slices/ValuationSlice';
import mortgageSlice from './slices/MortgageSlice';
import customerAuthSlice from './slices/CustomerAuthSlice';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
};

// Combine all reducers
const rootReducer = combineReducers({
  valuation: valuationReducer,
  mortgage: mortgageSlice,
  customerAuth: customerAuthSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       // Ignore these action types
  //       ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
  //     },
  //   }).concat(thunk),
});

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
