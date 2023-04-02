import React from 'react'
import { Outlet } from 'react-router-dom'
import DarkModeSwitch from '../components/DarkModeSwitch'
import PageTitle from '../components/PageTitle'
import ProfileButton from '../components/ProfileButton'
import Sidebar from '../components/Sidebar'

function ErrorLayout() {

    return (
        <div>
            <Sidebar />
            <div id='content'>
                <div id='page_content'>
                    <div className='centered'>
                        Nincs jogosultságod az oldalhoz!
                    </div>
                </div>
            </div>
            <ProfileButton />
        </div>
    )

}

export default ErrorLayout