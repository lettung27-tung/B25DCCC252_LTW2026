import { configureStore } from "@reduxjs/toolkit";
import matchesReducer from "./features/matchesSlice";
import goalReducer from "./features/goalSlice";
import { loadSaved, saveMatches } from "./storage";

const saved = loadSaved();

// true khi CHƯA có dữ liệu lưu (loadSaved() === null): lúc đó App mới nạp lịch thi đấu mẫu
export const hasSaved = saved === null;

const store = configureStore({
  reducer: {
    matches: matchesReducer,
    goal: goalReducer,
  },
  preloadedState: { matches: saved ?? [] },
});

// Chỉ lưu khi mảng trận đấu đổi tham chiếu
let previousMatches = store.getState().matches;
store.subscribe(() => {
  const currentMatches = store.getState().matches;
  if (currentMatches !== previousMatches) {
    previousMatches = currentMatches;
    saveMatches(currentMatches);
  }
});

export default store;
