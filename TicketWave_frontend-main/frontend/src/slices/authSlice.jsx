import { createSlice } from "@reduxjs/toolkit";
// import { userInfo } from 'os' //commented due to the browser im=ncompatability

const initialState = {
  userInfo: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      (state.userInfo = action.payload),
        localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;
