// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
});

export const { setUserDetails } = userSlice.actions;
export default userSlice.reducer;
