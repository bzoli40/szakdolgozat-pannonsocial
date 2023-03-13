import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import AuthenticationPanel from './AuthenticationPanel';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { setCloseMsg } from '../slices/authFireSlice';

function ProfileButton() {

    const [panelVisible, setPanelVisible] = useState(false)
    const [displayedName, setDisplayedName] = useState("");

    const dispatch = useAppDispatch();
    const { userLogged, msg_closeAuthPanel } = useSelector((state: any) => state.authFire);

    const onClickButton = (isTrue) => {
        setPanelVisible(isTrue)
    }

    useEffect(() => {
        setDisplayedName(userLogged.displayName)
    }, [userLogged])

    useEffect(() => {
        changeButtonWidth()
    }, [displayedName])

    useEffect(() => {

        if (msg_closeAuthPanel) {
            setPanelVisible(false)
            dispatch(setCloseMsg(false))
        }

    }, [msg_closeAuthPanel])

    const changeButtonWidth = () => {

        var profileButton = document.getElementById('profileButton');
        var nameHolder = document.getElementById('profile-nameholder');

        if (displayedName !== "" && displayedName != null)
            nameHolder.style.removeProperty('display')
        else
            nameHolder.style.display = "none"

        profileButton.style.maxWidth = profileButton.scrollWidth + "px";
    }

    return (
        <div className='z-500'>
            <button id='profileButton' onClick={() => { onClickButton(true) }}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <FontAwesomeIcon icon={regular('circle-user')} className="profileIcon" />
                            </td>
                            <td id='profile-nameholder'>
                                {
                                    displayedName !== "" ? <span>{displayedName}</span> : []
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </button>
            {
                panelVisible ? <AuthenticationPanel closeEvent={onClickButton} /> : []
            }
        </div>
    )
}

export default ProfileButton