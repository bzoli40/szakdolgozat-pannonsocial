import { Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import no_icon from './../../images/no_icon_image.png'
import test_icon from './../../images/699345047996ceb8ecabb23948f086c8.jpg'
import { Link } from 'react-router-dom';

import party_icon from './../../images/icons/party.png';
import university_icon from './../../images/icons/university.png';
import basic_icon from './../../images/icons/basic.png';
import holiday_icon from './../../images/icons/holiday.png';
import { useAppDispatch } from '../../store';
import { showToast } from '../../slices/toastSlice';
import { FormatForCard } from '../../utils/DateFormatting';


function EventCard({ eventObj }) {

    const dispatch = useAppDispatch();

    const start_date = new Date(eventObj.kezdes);
    const end_date = new Date(eventObj.vege);
    const need_hour = eventObj.kellOra;
    const currentDate = new Date();

    const GetIcon = () => {

        if (eventObj.tipus === 'szorakozas')
            return party_icon
        else if (eventObj.tipus === 'egyetemi')
            return university_icon
        else if (eventObj.tipus === 'szunet')
            return holiday_icon
        else
            return basic_icon
    }

    const renderContent = () => {
        return (
            <div className='listCard-horizontal-collapsing'>
                yes
            </div>
        );
    };

    const changeContentHeight = () => {

        var content = document.getElementById('details_' + eventObj._id);
        var card = document.getElementById('card_' + eventObj._id);
        var contents = document.querySelectorAll(".listCard-horizontal-collapsing");

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            contents.forEach((one) => {
                if ((one as HTMLElement) !== content)
                    (one as HTMLElement).style.maxHeight = null;
            });
            content.style.maxHeight = content.scrollHeight + "px";
            //dispatch(showToast({ type: "info", message: eventObj.megnevezes }));
        }
    }

    return (
        <div className='cardHolder2'>
            {/* <Link to={"/esemenyek/" + eventObj.id} className="noDeco">
                
            </Link> */}
            <div className='listCard-horizontal' id={'card_' + eventObj._id} onClick={() => { }}>
                <div className='listCard-horizontal-card'>
                    <img className='lC-icon2' src={GetIcon()}></img>
                    <span className='lC-name'>
                        {eventObj.megnevezes}
                    </span>
                    <span className='lC-date2'>
                        {FormatForCard(start_date, end_date, currentDate, need_hour)}
                    </span>
                </div>
                {/* <div className='listCard-horizontal-collapsing' id={'details_' + eventObj._id}>
                    yes
                </div> */}
            </div>
        </div>
    )
}

export default EventCard