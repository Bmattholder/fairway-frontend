import { configureStore } from "@reduxjs/toolkit";

import playerListReducer from "./slices/playerSlice";
import courseListReducer from "./slices/courseSlice";
import holeListReducer from "./slices/holeSlice";
import teeListReducer from "./slices/teeSlice";

const store = configureStore({
  reducer: {
    players: playerListReducer,
    courses: courseListReducer,
    holes: holeListReducer,
    tees: teeListReducer,
  },
});

export default store;
