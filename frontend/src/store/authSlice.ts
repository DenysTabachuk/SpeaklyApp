import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

type UserPayload = {
  userId: string;
  name: string;
  email: string;
};

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

let user = null;
if (accessToken) {
  try {
    const decoded = jwtDecode<UserPayload>(accessToken);
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
  accessToken,
  refreshToken,
  user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      console.log(action.payload);
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
