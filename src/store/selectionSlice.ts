import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SelectedItem {
  id: string;
  name: string;
  birth_year: string;
  url: string;
}

export interface SelectionState {
  items: SelectedItem[];
}

const initialState: SelectionState = {
  items: [],
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<SelectedItem>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    unselectAll: (state) => {
      state.items = [];
    },
  },
});

export const { toggleSelection, unselectAll } = selectionSlice.actions;
export default selectionSlice.reducer;
