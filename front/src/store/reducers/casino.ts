import { createSlice } from '@reduxjs/toolkit';
import type { ICasinoNav, ICasinoGame } from 'src/types';

type initialStateType = {
  casino_lists: ICasinoNav[];
  top_games: ICasinoGame[];
  fast_games: ICasinoGame[];
};

const initialState: initialStateType = {
  casino_lists: [],
  top_games: [],
  fast_games: [],
};

const casino = createSlice({
  name: 'casino',
  initialState,
  reducers: {
    updateCasinoLists(state, action) {
      state.casino_lists = action.payload;
    },
    updateTopGames(state, action) {
      state.top_games = action.payload;
    },
    updateFastGames(state, action) {
      state.fast_games = action.payload;
    },
  },
});

export default casino.reducer;

export const { updateCasinoLists, updateTopGames, updateFastGames } = casino.actions;