import { configureStore } from "@reduxjs/toolkit";
import complaintsReducer from "./slices/complaintsSlice.js";
import pollsReducer from "./slices/pollsSlice.js";
import menuReducer from "./slices/menuSlice.js";

export const store = configureStore({
  reducer: { complaints: complaintsReducer, polls: pollsReducer, menu: menuReducer }
});