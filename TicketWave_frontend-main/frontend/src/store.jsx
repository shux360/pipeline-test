import { configureStore } from "@reduxjs/toolkit";
import adminSliceReducer from "./slices/adminSlice";
import authSliceReducer from "./slices/authSlice";


const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    role: adminSliceReducer,
  },
});

export default store;
