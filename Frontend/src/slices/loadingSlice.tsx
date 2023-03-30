import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        load: false
    },
    reducers: {
        setLoad: (state, action) => {
            state.load = action.payload
        }
    }
});

export const { setLoad } = loadingSlice.actions;
export default loadingSlice.reducer;