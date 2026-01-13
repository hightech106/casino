import { createSlice } from '@reduxjs/toolkit';
import type { BetslipProps, SportsHistoryProps, ISportsList, ISportsEvent, ISportsMatch } from 'src/types';

type initialStateType = {
  sports_list: ISportsList[];
  bet_slips: BetslipProps[];
  active_history: SportsHistoryProps[];
  // New sports data management
  matches: ISportsEvent[];
  leagues: Array<{id: number, name: string, logo?: string, events: ISportsEvent[]}>;
  liveMatches: ISportsEvent[];
  upcomingMatches: ISportsEvent[];
  loading: boolean;
  lastUpdated: number;
  liveToggle: boolean; // For filtering live vs all matches
};

const initialState: initialStateType = {
  sports_list: [],
  bet_slips: [],
  active_history: [],
  // New sports data management
  matches: [],
  leagues: [],
  liveMatches: [],
  upcomingMatches: [],
  loading: false,
  lastUpdated: 0,
  liveToggle: false,
};

const sports = createSlice({
  name: 'sports',
  initialState,
  reducers: {
    updateSportsList(state, action) {
      state.sports_list = action.payload;
    },
    updateBetSlip(state, action) {
      state.bet_slips = action.payload;
    },
    updateHistory(state, action) {
      state.active_history = action.payload;
    },
    // New sports data actions
    setSportsLoading(state, action) {
      state.loading = action.payload;
    },
    updateSportsMatches(state, action) {
      const { matches, leagues } = action.payload;
      state.matches = matches;
      state.leagues = leagues;
      state.liveMatches = matches.filter((match: ISportsEvent) => match.time_status === 1);
      state.upcomingMatches = matches.filter((match: ISportsEvent) => match.time_status === 0);
      state.lastUpdated = Date.now();
    },
    updateLiveMatches(state, action) {
      const liveMatches = action.payload;
      // Update live matches in the main matches array
      state.matches = state.matches.map(match => {
        const liveMatch = liveMatches.find((lm: ISportsEvent) => lm.id === match.id);
        return liveMatch || match;
      });
      
      // Update live matches array
      state.liveMatches = state.matches.filter((match: ISportsEvent) => match.time_status === 1);
      
      // Update leagues with new match data
      state.leagues = state.leagues.map(league => ({
        ...league,
        events: league.events.map(event => {
          const liveMatch = liveMatches.find((lm: ISportsEvent) => lm.id === event.id);
          return liveMatch || event;
        })
      }));
      
      state.lastUpdated = Date.now();
    },
    toggleLiveFilter(state) {
      state.liveToggle = !state.liveToggle;
    },
    setLiveFilter(state, action) {
      state.liveToggle = action.payload;
    },
  },
});

export default sports.reducer;

export const { 
  updateSportsList, 
  updateHistory, 
  updateBetSlip,
  setSportsLoading,
  updateSportsMatches,
  updateLiveMatches,
  toggleLiveFilter,
  setLiveFilter
} = sports.actions;
