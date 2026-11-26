import { configureStore } from "@reduxjs/toolkit";
import matchesReducer from "./features/matchesSlice";
import goalReducer from "./features/goalSlice";

const store = configureStore({
  reducer: {
    matches: matchesReducer,
    goal: goalReducer,
  },
});

export default store;
