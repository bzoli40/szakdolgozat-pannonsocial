import React from 'react'
import { Outlet } from 'react-router-dom'
import DarkModeSwitch from '../components/DarkModeSwitch'
import PageTitle from '../components/PageTitle'
import ProfileButton from '../components/ProfileButton'
import Sidebar from '../components/Sidebar'

function HomeLayout() {

    return (
        <div>
            <div id='content-full'>
                <div id='header'>
                    <p id='header-title'>
                        {<PageTitle />}
                    </p>
                </div>
                <div id='page_content'>
                    <Outlet />
                </div>
            </div>
            <DarkModeSwitch />
            <ProfileButton />
        </div>
    )

}

export default HomeLayout