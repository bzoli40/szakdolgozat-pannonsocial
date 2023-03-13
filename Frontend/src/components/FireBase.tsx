import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { setCloseMsg, setCredentials, setLoggedIn, setLogin, setLogout, setUserDisplayName } from '../slices/authFireSlice';
import { showToast } from '../slices/toastSlice';

const firebaseConfig = {
    apiKey: "AIzaSyASX6TiMjBBts7sPi-w_8L9136_OF-c-Dg",
    authDomain: "szakdolgozat-newents.firebaseapp.com",
    projectId: "szakdolgozat-newents",
    storageBucket: "szakdolgozat-newents.appspot.com",
    messagingSenderId: "634803468254",
    appId: "1:634803468254:web:dc1273b791ae55fc370f4f",
    measurementId: "G-92QH3WJEM7"
};

function FireBase() {

    const dispatch = useAppDispatch();
    const { wantLogin, credentials, wantLogout } = useSelector((state: any) => state.authFire);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app)

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(auth.currentUser.email)

            dispatch(setLoggedIn(true))

            dispatch(setUserDisplayName(auth.currentUser.displayName))
        }
    });

    const user = auth.currentUser;

    const [email, setEmail] = useState("");
    const [psw, setPsw] = useState("");

    const createNewUser = (email, psw) => {
        createUserWithEmailAndPassword(auth, email, psw)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(`[FIREBASE]`)
                console.log(user)
                dispatch(setLoggedIn(true))
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(`[${errorCode}] ${errorMessage}`)
            });
    }

    const loginToUser = (email, psw) => {
        signInWithEmailAndPassword(auth, email, psw)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(`[FIREBASE]`)
                dispatch(showToast({ type: "success", message: "Sikeres bejelentkezés" }))
                dispatch(setLoggedIn(true))
                dispatch(setCloseMsg(true))
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(`[${errorCode}] ${errorMessage}`)
            });
    }

    const logOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Successful logout")
            dispatch(setUserDisplayName(""))
            dispatch(setLoggedIn(false))
            dispatch(setCloseMsg(true))
            dispatch(showToast({ type: "success", message: "Sikeres kijelentkezés" }))
        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
    }

    useEffect(() => {
        if (wantLogin) {

            loginToUser(credentials.email, credentials.password)

            dispatch(setLogin(false))
            dispatch(setCredentials({ email: "", password: "" }))
        }
    }, [wantLogin])

    useEffect(() => {
        if (wantLogout) {

            logOut()
            dispatch(setLogout(false))
            dispatch(setCredentials({ email: "", password: "" }))
        }
    }, [wantLogout])

    return (
        null
    )
}

export default FireBase