import React, { useEffect, useState } from 'react';

//Toastify version

import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/elements/toastifyModifies.css'

function NotificationSystem() {
    return (
        <div>
            <ToastContainer autoClose={1500} />
        </div>
    )
}

export default NotificationSystem


/* // Personal version

function NotificationSystem() {

    const [notifications, setNotifications] = useState([]);

    const addNotification = (_type: string, _message: string, _duration: number) => {

        console.log("A");

        var not_id = Date.now()
        console.log(not_id)

        setNotifications([...notifications, {
            id: not_id,
            message: _message,
            type: _type,
            duration: _duration,
            shown: true
        }]);
        console.log("B");

        console.log(notifications.length);

        setTimeout(() => {
            console.log("C");
            removeNotification(not_id);
        }, _duration);
    }

    const removeNotification = (_id) => {
        setNotifications(notifications.filter(notif => notif.id !== _id))
        console.log("D");
    }

    return (
        <div id='notification-layout' className='z-500'>
            {notifications.map((notification) => (
                <NotificationPopup _notif_type={notification.type} _notif_message={notification.message} key={notification.id} />
            ))}
            <button onClick={() => addNotification('wrong', 'HIBA: Nem tudott feljelentkezni', 3000)}>Valami</button>
        </div>
    )
}

export default NotificationSystem */

/*

function NotificationPopup({ _notif_type, _notif_message }) {

    const icon = () => {
        switch (_notif_type) {
            case 'okay':
                return okay_icon
                break;

            default:
                return wrong_icon
                break;
        }
    }

    return (
        <div className='notification-popup'>
            <img src={icon()} className='float-left notification-icon'></img>
            <span className='float-left notification-message-box'>{_notif_message}</span>
        </div>
    )
}

export default NotificationPopup

*/