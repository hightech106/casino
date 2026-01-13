import type { IMenu } from 'src/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IMenu = {
  selectedItem: ['home'],
  drawerOpen: true,
  headerHide: false,
  footerHide: false,
  page: '',
};

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.selectedItem = action.payload;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },

    hideHeader(state, action) {
      state.headerHide = action.payload;
    },

    hideFooter(state, action) {
      state.footerHide = action.payload;
    },

    ChangePage(state, action) {
      state.page = action.payload;
    },
  },
});

export default menu.reducer;

export const { activeItem, openDrawer, hideHeader, hideFooter, ChangePage } = menu.actions;
