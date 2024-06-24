// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id_user: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  language: string | null;
  twofa: boolean;
  created_at: string;
  updated_at: string;
  isemailverified: boolean;
  isphoneverified: boolean;
  isadmin: boolean;
  login_type: string;
  avatar: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      // Define setUser action
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { userLogout, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
