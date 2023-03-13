import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div id="sidebar" className='z-400'>
            {/* <div id="sidebar-content">
                <div className='sidebar-category-panel'>
                    <div className='sidebar-icon-holder'>
                        <FontAwesomeIcon icon={solid('house')} className="sidebar-category-icon" />
                    </div>
                    <p className='sidebar-menu-category'>
                        Főoldal
                    </p>
                    <ul className='sidebar-menu-pages'>
                        <li>
                            <Link to="/">
                                <button className='sidebar-page-button'>
                                    Kezdőlapra
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='sidebar-category-panel'>
                    <div className='sidebar-icon-holder'>
                        <FontAwesomeIcon icon={regular('newspaper')} className="sidebar-category-icon" />
                    </div>
                    <p className='sidebar-menu-category'>
                        Hírek
                    </p>
                    <ul className='sidebar-menu-pages'>
                        <li>
                            <Link to="/hirek?type=egyetemi">
                                <button className='sidebar-page-button'>
                                    Egyetemi
                                </button>
                            </Link>

                        </li>
                        <li>
                            <Link to="/hirek?type=kari">
                                <button className='sidebar-page-button'>
                                    Kari
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/hirek?type=pehok">
                                <button className='sidebar-page-button'>
                                    PEHÖK
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/hirek?type=kollegiumi">
                                <button className='sidebar-page-button'>
                                    Kollégiumi
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/hirek?type=surgos">
                                <button className='sidebar-page-button'>
                                    Sűrgős
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='sidebar-category-panel'>
                    <div className='sidebar-icon-holder'>
                        <FontAwesomeIcon icon={regular('calendar')} className="sidebar-category-icon" />
                    </div>
                    <p className='sidebar-menu-category'>
                        Események
                    </p>
                    <ul className='sidebar-menu-pages'>
                        <li>
                            <button className='sidebar-page-button'>
                                Keresés
                            </button>
                        </li>
                        <li>
                            <Link to="/esemenyek">
                                <button className='sidebar-page-button'>
                                    Naptár
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='sidebar-category-panel'>
                    <div className='sidebar-icon-holder'>
                        <FontAwesomeIcon icon={solid('screwdriver-wrench')} className="sidebar-category-icon" />
                    </div>
                    <p className='sidebar-menu-category'>
                        Eszközök
                    </p>
                    <ul className='sidebar-menu-pages'>
                        <li>
                            <Link to="/szerkeszto">
                                <button className='sidebar-page-button'>
                                    Szerkesztő
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div> */}
        </div>
    )
}

export default Sidebar