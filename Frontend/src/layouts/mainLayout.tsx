import React, { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import AuthenticationPanel from '../components/AuthenticationPanel'
import DarkModeSwitch from '../components/DarkModeSwitch'
import NotificationBell from '../components/NotificationBell'
import PageTitle from '../components/PageTitle'
import ProfileButton from '../components/ProfileButton'
import Sidebar from '../components/Sidebar'

function MainLayout() {

    return (
        <div>
            <Sidebar />
            <div id='content'>
                <div id='header'>
                    <p id='header-title'>
                        {<PageTitle />}
                    </p>
                </div>
                <div id='page_content'>
                    <Outlet />
                </div>
            </div>
            <ProfileButton />
        </div>
    )
}

export default MainLayout