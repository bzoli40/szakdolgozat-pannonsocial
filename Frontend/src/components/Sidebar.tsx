import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Link } from 'react-router-dom';
import pp_icon from './../images/icons/pe_social.png';
import NotificationBell from './NotificationBell';
import DarkModeSwitch from './DarkModeSwitch';

function Sidebar() {

    const [currentSite, setCurrentSite] = useState('');

    let params = new URLSearchParams(window.location.search);
    let subSite = window.location.pathname;

    useEffect(() => {

        var siteSelected = "";
        var subSiteSliced = subSite.split('/');

        // Oldalcím megadása
        if (subSiteSliced.length == 2) {
            switch (subSite) {
                case "/":
                    siteSelected = "fooldal"
                    break;
                case "/hirek":
                    switch (params.get("type")) {
                        case "egyetemi":
                            siteSelected = "egyetemihir";
                            break;
                        case "kari":
                            siteSelected = "karihir";
                            break;
                        case "pehok":
                            siteSelected = "pehokhir";
                            break;
                        case "kollegiumi":
                            siteSelected = "kolihir";
                            break;
                    }
                    break;
                case "/szerkeszto":
                    siteSelected = "szerkeszto"
                    break;
                case "/esemenyek":
                    siteSelected = "naptaresemeny"
                    break;
            }
        }

        setCurrentSite(siteSelected);

    }, [window.location.pathname, window.location.search])

    return (
        <div id="sidebar" className='z-400'>
            <img id='site-icon' src={pp_icon} />
            <br />
            <span id='site-name'>Pannon Platform</span>
            <div id="sidebar-content">
                <p className='sidebar-menu-category'>
                    Főoldal
                </p>
                <ul className='sidebar-menu-pages'>
                    <li>
                        <Link to="/">
                            <button className={'sidebar-page-button ' + (currentSite === 'fooldal' ? 'selected' : '')}>
                                Kezdőlap
                            </button>
                        </Link>
                    </li>
                </ul>
                <div className='sidebar-category-panel'>
                    <p className='sidebar-menu-category'>
                        Hírek
                    </p>
                    <ul className='sidebar-menu-pages'>
                        <li>
                            <Link to="/hirek?type=egyetemi">
                                <button className={'sidebar-page-button ' + (currentSite === 'egyetemihir' ? 'selected' : '')}>
                                    Egyetemi
                                </button>
                            </Link>

                        </li>
                        <li>
                            <Link to="/hirek?type=kari">
                                <button className={'sidebar-page-button ' + (currentSite === 'karihir' ? 'selected' : '')}>
                                    Kari
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/hirek?type=pehok">
                                <button className={'sidebar-page-button ' + (currentSite === 'pehokhir' ? 'selected' : '')}>
                                    PEHÖK
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/hirek?type=kollegiumi">
                                <button className={'sidebar-page-button ' + (currentSite === 'kolihir' ? 'selected' : '')}>
                                    Kollégiumi
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='sidebar-category-panel'>
                    <p className='sidebar-menu-category'>
                        Események
                    </p>
                    <ul className='sidebar-menu-pages'>
                        <li>
                            <Link to="/esemenyek">
                                <button className={'sidebar-page-button ' + (currentSite === 'naptaresemeny' ? 'selected' : '')}>
                                    Naptár
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='sidebar-category-panel'>
                    <p className='sidebar-menu-category'>
                        Eszközök
                    </p>
                    <ul className='sidebar-menu-pages'>
                        <li>
                            <Link to="/szerkeszto">
                                <button className={'sidebar-page-button ' + (currentSite === 'szerkeszto' ? 'selected' : '')}>
                                    Szerkesztő
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <NotificationBell />
            <DarkModeSwitch />
        </div>
    )
}

export default Sidebar