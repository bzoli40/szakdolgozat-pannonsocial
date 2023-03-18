import React, { useEffect, useState } from 'react';
import { getCookie, setCookie } from '../utils/CookieFunctions';


import night_mode from '../images/icons/night_mode.png';
import day_mode from '../images/icons/day_mode.png';
import { useAppDispatch, useAppSelector } from '../store';
import { setDarkMode } from '../slices/darkModeSlice';
import { useSelector } from 'react-redux';

function DarkModeSwitch() {

  const dispatch = useAppDispatch();
  const { darkMode } = useSelector((state: any) => state.darkMode);

  const [checked, setChecked] = useState(false);

  // Ha változik a weben a darkMode, akkor a cookit is beállítja
  useEffect(() => {
    if (checked) {
      setCookie('darkMode', darkMode);
      //console.log('DarkMode is: ' + getCookie('darkMode'))
    }

  }, [darkMode]);

  // Mwgnézi induláskor, hogy van-e már darkMode cookie az oldalhoz:
  // - Ha igen, akkor azzal dolgozik
  // - Ha nem, akkor a rendszeralapértelmezettet figyeli
  useEffect(() => {
    let darkModeCookie = getCookie('darkMode');

    if (darkModeCookie === '' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch(setDarkMode(true));
    }
    else if (darkModeCookie === 'true') {
      dispatch(setDarkMode(true));
    }

    setChecked(true);
    //console.log('Init DarkMode after getters is: ' + getCookie('darkMode'));
  }, []);

  return (
    <div className='z-500'>
      <button className='darkModeButton' onClick={() => dispatch(setDarkMode(!darkMode))}>
        <img src={darkMode ? day_mode : night_mode} className={"darkModeIcon darkModeIconAnim-" + (darkMode ? "1" : "2")} ></img>
      </button>
    </div>
  )
}

export default DarkModeSwitch