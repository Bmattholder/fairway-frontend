import { createSlice } from "@reduxjs/toolkit";

const initialTeeState = {
  teeList: [],
};

const teeSlice = createSlice({
  name: "tee",
  initialState: initialTeeState,
  reducers: {
    setTee(state, action) {
      state.teeList = action.payload;
    },
  },
});

export const teeActions = teeSlice.actions;

export default teeSlice.reducer;
