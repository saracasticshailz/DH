import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Application } from '@/components/Rm/ApplicationStatusUtils';

// Define the state interface
interface RmDashboardState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: RmDashboardState = {
  applications: [],
  loading: false,
  error: null,
};

// Create the slice
const rmDashboardSlice = createSlice({
  name: 'rmDashboard',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set applications list
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
    },

    // Add a single application
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.push(action.payload);
    },

    // Update a single application
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex((app) => app.referenceNo === action.payload.referenceNo);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },

    // Clear all applications
    clearApplications: (state) => {
      state.applications = [];
    },
  },
});

// Export actions
export const { setLoading, setError, setApplications, addApplication, updateApplication, clearApplications } =
  rmDashboardSlice.actions;

// Export reducer
export default rmDashboardSlice.reducer;
