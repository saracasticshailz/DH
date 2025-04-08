import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from '../../store/index';

export interface RmAuthState {
  rmCode: string
  oprstatus: number
  rmMobile: string
  returnCode: string
  rmEmailId: string
  opstatus: number
  rmName: string
  isAuthenticated?: boolean 
}

const initialState: RmAuthState = {
  rmCode: "",
  oprstatus: 0,
  rmMobile: "",
  returnCode: "",
  rmEmailId: "",
  opstatus: 0,
  rmName: "",
  isAuthenticated: false,
}

// Create the slice
export const rmAuth = createSlice({
  name: "rmAuth",
  initialState,
  reducers: {
    setRmData: (state, action: PayloadAction<Omit<RmAuthState, "isAuthenticated">>) => {
      return { ...state, ...action.payload, isAuthenticated: true }
    },

    updateRmCode: (state, action: PayloadAction<string>) => {
      state.rmCode = action.payload
    },
    updateRmMobile: (state, action: PayloadAction<string>) => {
      state.rmMobile = action.payload
    },
    updateRmEmail: (state, action: PayloadAction<string>) => {
      state.rmEmailId = action.payload
    },
    updateRmName: (state, action: PayloadAction<string>) => {
      state.rmName = action.payload
    },

    // Reset authentication state
    resetRmAuth: () => initialState,

    // Set authentication status
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
  },
})

export const { setRmData, updateRmCode, updateRmMobile, updateRmEmail, updateRmName, resetRmAuth, setAuthenticated } =
  rmAuth.actions

export const selectRmAuth = (state: RootState) => state.rmAuth
export const selectIsAuthenticated = (state: RootState) => state.rmAuth.isAuthenticated
export const selectRmName = (state: RootState) => state.rmAuth.rmName
export const selectRmCode = (state: RootState) => state.rmAuth.rmCode
export const selectRmEmail = (state: RootState) => state.rmAuth.rmEmailId

export default rmAuth.reducer
