import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useAppDispatch } from '../store';
import { setCredentials, setLogin, setLogout, setRegisterEmailPassword } from '../slices/authFireSlice';
import { useSelector } from 'react-redux';

function AuthenticationPanel({ closeEvent }) {

    const dispatch = useAppDispatch();
    const [mode, setMode] = useState("login")
    const { loggedIn } = useSelector((state: any) => state.authFire);

    const LoginWithEmailPassword = event => {
        event.preventDefault();

        dispatch(setCredentials({ email: event.target.log_email.value, password: event.target.log_password.value }))
        dispatch(setLogin(true))
    }

    const RegisterWithEmailPassword = event => {
        event.preventDefault();

        console.log("A")

        dispatch(setCredentials({ email: event.target.reg_email.value, password: event.target.reg_password.value, fullName: event.target.reg_fullName.value }))
        dispatch(setRegisterEmailPassword(true))
    }

    const Logout = event => {
        event.preventDefault();

        dispatch(setLogout(true))
    }

    return (
        <div>
            <div className='shadow-background z-600' onClick={() => { closeEvent(false) }}>
            </div>
            <div id='auth-panel'>
                <button className='close-button' onClick={() => { closeEvent(false) }}>✖</button>
                <p className='panel-header'>
                    {
                        loggedIn ? 'Fiók' :
                            mode === "login" ? 'Belépés' :
                                mode === 'register' ? 'Regisztráció' :
                                    []
                    }
                </p>
                {
                    loggedIn ?
                        <div>
                            <div className='auth-panel-divider'>
                                <button className='auth-action-button' onClick={Logout}>
                                    KIJELENTKEZÉS
                                </button>
                            </div>
                        </div>
                        :
                        mode === "login" ?
                            <div>
                                <form onSubmit={LoginWithEmailPassword}>
                                    <table className='panel-inputs'>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <label className='input-label'>E-mail cím</label>
                                                </td>
                                                <td>
                                                    <input name="log_email" type={"text"} className="form-control text-input" placeholder='valami@cim.hu' />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label className='input-label'>Jelszó</label>
                                                </td>
                                                <td>
                                                    <input name="log_password" type={"password"} className="form-control text-input" placeholder='Jelszó' />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="alignCenter">
                                                    <button className='auth-action-button' type='submit'>
                                                        BELÉPÉS
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                                <div className='auth-panel-divider'>
                                    <p className='no-margin'>
                                        Elfelejtett jelszó | <span className='clickable' onClick={() => { setMode("register") }}>Új fiók</span>
                                    </p>
                                </div>
                                {/* <p>
                                    Elfelejtett jelszó | <span className='clickable' onClick={() => { setMode("register") }}>Új fiók</span>
                                </p>
                                <div className='auth-panel-divider'>
                                    <button className='other-accounts-button google-icon'>
                                        <FontAwesomeIcon icon={brands('google')} className="icon" />
                                    </button>
                                    <button className='other-accounts-button facebook-icon'>
                                        <FontAwesomeIcon icon={brands('facebook-f')} className="icon" />
                                    </button>
                                    <button className='other-accounts-button microsoft-icon'>
                                        <FontAwesomeIcon icon={brands('microsoft')} className="icon" />
                                    </button>
                                </div> */}
                            </div>
                            : mode === "register" ?
                                <div>
                                    <form onSubmit={RegisterWithEmailPassword}>
                                        <table className='panel-inputs'>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <label className='input-label'>E-mail cím</label>
                                                    </td>
                                                    <td>
                                                        <input name="reg_email" type={"text"} className="form-control text-input" placeholder='valami@cim.hu' />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label className='input-label'>Teljes név</label>
                                                    </td>
                                                    <td>
                                                        <input name="reg_fullName" type={"text"} className="form-control text-input" placeholder='Teszt János' />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label className='input-label'>Jelszó</label>
                                                    </td>
                                                    <td>
                                                        <input name="reg_password" type={"password"} className="form-control text-input" placeholder='Jelszó' />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2} className="alignCenter">
                                                        <button className='auth-action-button' type='submit'>
                                                            REGISZTRÁCIÓ
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                    <div className='auth-panel-divider'>
                                        <p className='no-margin'>
                                            <span className='clickable' onClick={() => { setMode("login") }}>Már van fiókom</span>
                                        </p>
                                    </div>
                                </div>
                                : []
                }
            </div>
        </div>
    )
}

export default AuthenticationPanel