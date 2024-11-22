import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './fileSlice';
import viewReducer from './viewSlice';

const store = configureStore({
    reducer: {
        file: fileReducer,
        view: viewReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 