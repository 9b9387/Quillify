import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ViewMode = 'preview' | 'split' | 'source';

interface ViewState {
  mode: ViewMode;
}

const initialState: ViewState = {
  mode: 'split'  // 默认值
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.mode = action.payload;
    }
  }
});

export const { setViewMode } = viewSlice.actions;
export default viewSlice.reducer; 