import React, { useState } from 'react'
import hasNotification from '../images/icons/notif_has.png';
import noNotification from '../images/icons/notif_empty.png';

function NotificationBell() {

    const [panelVisible, setPanelVisible] = useState(false)

    const onClickButton = (isTrue) => {
        setPanelVisible(isTrue)
    }

    return (
        <div>
            <div className='notification-bell'>
                <img src={noNotification} onClick={() => onClickButton(true)}></img>
            </div >
            {
                panelVisible ?
                    <div>
                        <div className='shadow-background z-600' onClick={() => { onClickButton(false) }}>
                        </div>
                        <div id='notifications-panel'>
                            <button className='close-button' onClick={() => { onClickButton(false) }}>✖</button>
                            <p className='panel-header'>
                                Értesítések
                            </p>
                        </div>
                    </div> : []
            }
        </div>
    )
}

export default NotificationBell