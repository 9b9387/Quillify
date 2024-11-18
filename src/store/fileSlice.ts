import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import murmurhash from 'murmurhash';

interface FileState {
    content: string;
    filePath: string | null;
    isModified: boolean;
    lastSavedHash: number;
}

const initialState: FileState = {
    content: '',
    filePath: null,
    isModified: false,
    lastSavedHash: 0
};

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        openFile(state, action: PayloadAction<{ content: string; filePath: string }>) {
            state.content = action.payload.content;
            state.filePath = action.payload.filePath;
            state.isModified = false;
            state.lastSavedHash = murmurhash.v3(action.payload.content);
        },
        saveFile(state, _: PayloadAction<void>) {
            state.lastSavedHash = murmurhash.v3(state.content);
            state.isModified = false;
        },
        updateContent(state, action: PayloadAction<{ content: string }>) {
            state.content = action.payload.content;
            state.isModified = state.lastSavedHash !== murmurhash.v3(action.payload.content);
        },
    },
});

export const { openFile, saveFile, updateContent } = fileSlice.actions;
export default fileSlice.reducer; 