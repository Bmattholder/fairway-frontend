import { createSlice } from "@reduxjs/toolkit";

const initialHoleState = {
  holeList: [],
};

const holeSlice = createSlice({
  name: "hole",
  initialState: initialHoleState,
  reducers: {
    setHole(state, action) {
      state.holeList = action.payload;
    },
  },
});

export const holeActions = holeSlice.actions;

export default holeSlice.reducer;
