import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const courtSlice = createSlice({
  name: "court",
  initialState,
  reducers: {
    setCourts: (state, action) => {
      state.courts = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = courtSlice.actions;

export default courtSlice.reducer;
