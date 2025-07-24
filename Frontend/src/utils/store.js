// src/utils/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice"; // ✅ make sure this file exists
import authReducer from '../redux/authSlice'; // ✅ make sure this file exists

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,

  },
});

export default store;
