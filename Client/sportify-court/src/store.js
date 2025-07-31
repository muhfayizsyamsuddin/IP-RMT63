import { configureStore } from "@reduxjs/toolkit";
import courtReducer from "./features/booking/counterSlice";

export const store = configureStore({
  reducer: {
    court: courtReducer,
  },
});
