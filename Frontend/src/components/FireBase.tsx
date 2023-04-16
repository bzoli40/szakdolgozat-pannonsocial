import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { setCloseMsg, setCredentials, setFirebaseID, setInnitReadHappened, setLoggedIn, setLogin, setLogout, setPermissions, setRegisterEmailPassword, setUserDisplayName } from '../slices/authFireSlice';
import { showToast } from '../slices/toastSlice';
import axios from 'axios';
import { setLoad } from '../slices/loadingSlice';

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
    const { wantLogin, credentials, wantLogout, wantRegister, userLogged } = useSelector((state: any) => state.authFire);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app)

    onAuthStateChanged(auth, (user) => {

        dispatch(setInnitReadHappened(true))

        if (user) {
            dispatch(setLoggedIn(true))
            dispatch(setUserDisplayName(auth.currentUser.displayName))
        }
    });

    useEffect(() => {

        const uid = auth.currentUser?.uid

        if (uid !== "" && uid !== undefined) {

            dispatch(setFirebaseID(uid));

            axios.get(`http://localhost:3001/api/felhasznalok/${uid}/jogok`)
                .then(response => {
                    dispatch(setPermissions(response.data))
                    console.log(response.data)
                })
                .catch(error => console.log(error));
        }
        else {
            dispatch(setFirebaseID(""));
            dispatch(setPermissions({}))
        }

    }, [auth.currentUser, window.location.pathname, window.location.search])

    const user = auth.currentUser;

    const [email, setEmail] = useState("");
    const [psw, setPsw] = useState("");

    const registerUser = (email, psw, fullName) => {
        createUserWithEmailAndPassword(auth, email, psw)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(`[FIREBASE]`)
                console.log(user)

                updateProfile(user, {
                    displayName: fullName
                }).then(() => {

                    axios.post('http://localhost:3001/api/felhasznalok/',
                        {
                            teljes_nev: fullName,
                            email: email,
                            idFireBase: user.uid
                        })
                        .then(response => {

                            dispatch(setLoggedIn(true))
                            dispatch(setCloseMsg(true))
                            dispatch(setUserDisplayName(user.displayName))
                            dispatch(showToast({ type: "success", message: "Sikeres regisztráció" }))
                        })
                        .catch(error => console.log(error));

                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    console.log(`[${errorCode}] ${errorMessage}`)
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(`[${errorCode}] ${errorMessage}`)
            });
    }

    const loginToUser = (email, psw) => {

        dispatch(setLoad(true));

        signInWithEmailAndPassword(auth, email, psw)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(`[FIREBASE]`)
                dispatch(showToast({ type: "success", message: "Sikeres bejelentkezés" }))
                dispatch(setLoggedIn(true))
                dispatch(setCloseMsg(true))
                dispatch(setLoad(false));
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(`[${errorCode}] ${errorMessage}`)
            });
    }

    const logOut = () => {

        dispatch(setLoad(true));
        dispatch(setCloseMsg(true))

        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Successful logout")
            dispatch(setUserDisplayName(""))
            dispatch(setLoggedIn(false))
            dispatch(setLoad(false));
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
        if (wantRegister) {

            registerUser(credentials.email, credentials.password, credentials.fullName)

            dispatch(setRegisterEmailPassword(false))
            dispatch(setCredentials({ email: "", password: "", fullName: "" }))
        }
    }, [wantRegister])

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