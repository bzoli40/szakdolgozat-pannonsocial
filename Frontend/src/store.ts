import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import darkModeReducer from "./slices/darkModeSlice";
import authFireReducer from "./slices/authFireSlice";
import toastReducer from "./slices/toastSlice";
import thunk from "redux-thunk";

export const store = configureStore({
    reducer: {
        darkMode: darkModeReducer,
        authFire: authFireReducer,
        toast: toastReducer
    },
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
