import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const authFireSlice = createSlice({
    name: 'authFire',
    initialState: {
        initReadHappened: false,
        wantLogin: false,
        wantRegister: false,
        wantPasswordReset: false,
        wantLogout: false,
        credentials: {
            email: "",
            password: "",
            fullName: ""
        },
        userLogged: {
            displayName: "",
            firebaseID: "",
            mongoID: "",
            permissions: {}
        },
        loggedIn: false,
        msg_closeAuthPanel: false
    },
    reducers: {
        setInnitReadHappened: (state, action) => {
            state.initReadHappened = action.payload
        },
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
            state.wantRegister = action.payload
        },
        setPasswordReset: (state, action) => {
            state.wantPasswordReset = action.payload
        },
        setUserDisplayName: (state, action) => {
            state.userLogged.displayName = action.payload
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload
        },
        setPermissions: (state, action) => {
            state.userLogged.permissions = action.payload
        },
        setFirebaseID: (state, action) => {
            state.userLogged.firebaseID = action.payload
        },
        setMongoID: (state, action) => {
            state.userLogged.mongoID = action.payload
        },
        setCloseMsg: (state, action) => {
            state.msg_closeAuthPanel = action.payload
        }
    }
});

export const { setLogin, setRegisterEmailPassword, setPasswordReset, setCredentials, setUserDisplayName, setLoggedIn, setCloseMsg, setLogout, setPermissions, setFirebaseID, setMongoID, setInnitReadHappened } = authFireSlice.actions;
export default authFireSlice.reducer;