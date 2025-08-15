import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

type UserPayload = {
  userId: string;
  name: string;
  email: string;
};

const token = localStorage.getItem("token");
let user = null;
if (token) {
  try {
    const decoded = jwtDecode<UserPayload>(token);
    user = {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    };
  } catch (e) {
    console.error("Invalid token", e);
    localStorage.removeItem("token");
  }
}

const initialState = {
  token,
  user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
