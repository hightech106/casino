import { createSlice } from '@reduxjs/toolkit';
import type { IBanner } from 'src/types';

type initialStateType = {
    banners: IBanner[];
};

const initialState: initialStateType = {
    banners: [],
};

const casino = createSlice({
    name: 'config',
    initialState,
    reducers: {
        updateBanners(state, action) {
            state.banners = action.payload;
        },
    },
});

export default casino.reducer;

export const { updateBanners, } = casino.actions;
