import { createSlice } from "@reduxjs/toolkit";

const initialPlayerState = {
  playerList: [],
};

const playerSlice = createSlice({
  name: "player",
  initialState: initialPlayerState,
  reducers: {
    setPlayer(state, action) {
      state.playerList = action.payload;
    },
    setEditPlayerMode(state, action) {
      const { playerId, editMode } = action.payload;

      const player = state.playerList.find((p) => p.id === playerId);
      if (player) {
        player.editMode = editMode;
      }
    },
  },
});

export const playerActions = playerSlice.actions;

export default playerSlice.reducer;
