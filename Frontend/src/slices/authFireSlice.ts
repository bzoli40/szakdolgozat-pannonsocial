import { createSlice } from "@reduxjs/toolkit";

export const authFireSlice = createSlice({
    name: 'authFire',
    initialState: {
        //userLogged: { UserImpl: {} },
        wantLogin: false,
        wantRegisterEmailPassword: false,
        wantPasswordReset: false,
        wantLogout: false,
        credentials: {
            email: "",
            password: ""
        },
        userLogged: {
            displayName: ""
        },
        loggedIn: false,
        msg_closeAuthPanel: false
    },
    reducers: {
        setCredentials: (state, action) => {
            state.credentials = action.payload
        },
        setLogin: (state, action) => {
            state.wantLogin = action.payload
        },
        setLogout: (state, action) => {
            state.wantLogout = action.payload
        },
        setRegisterEmailPassword: (state, action) => {
            state.wantRegisterEmailPassword = action.payload
        },
        setPasswordReset: (state, action) => {
            state.wantPasswordReset = action.payload
        },
        setUserDisplayName: (state, action) => {
            state.userLogged.displayName = action.payload
            console.log(action.payload)
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload
        },
        setCloseMsg: (state, action) => {
            state.msg_closeAuthPanel = action.payload
        }
    }
});

export const { setLogin, setRegisterEmailPassword, setPasswordReset, setCredentials, setUserDisplayName, setLoggedIn, setCloseMsg, setLogout } = authFireSlice.actions;
export default authFireSlice.reducer;