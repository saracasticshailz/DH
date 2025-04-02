import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import valuationReducer from './slices/ValuationSlice';
import mortgageSlice from './slices/MortgageSlice';
import customerAuthSlice from './slices/CustomerAuthSlice';
import rmDashSlice from './slices/RmDashboardSlice';

const persistConfig = {
  key: 'root',
  storage,
  // Optionally blacklist any reducers you don't want to persist
  // blacklist: ['someReducer']
};

const rootReducer = combineReducers({
  valuation: valuationReducer,
  mortgage: mortgageSlice,
  customerAuth: customerAuthSlice,
  rmDashboard: rmDashSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux-Persist action types that contain non-serializable values
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
