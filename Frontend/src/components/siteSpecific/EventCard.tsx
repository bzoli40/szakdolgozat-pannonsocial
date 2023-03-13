import { Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import no_icon from './../../images/no_icon_image.png'
import test_icon from './../../images/699345047996ceb8ecabb23948f086c8.jpg'
import { Link } from 'react-router-dom';

import party_icon from './../../images/icons/party.png';
import university_icon from './../../images/icons/university.png';
import basic_icon from './../../images/icons/basic.png';
import { useAppDispatch } from '../../store';
import { showToast } from '../../slices/toastSlice';


function EventCard({ eventObj }) {

    const dispatch = useAppDispatch();

    const start_date = eventObj.start_date.toDate() as Date;
    const end_date = eventObj.end_date.toDate() as Date;
    const currentDate = new Date();

    const FormatPart = (input, toCharLength, fillupChar) => {

        var charDifference = toCharLength - input.toString().length;
        var bonus = "";

        for (let x = 0; x < charDifference; x++)
            bonus += fillupChar;

        return bonus + input + "";

    }

    const AreDaysSame = (dateA: Date, dateB: Date) => {
        return dateA.getFullYear() === dateB.getFullYear()
            && dateA.getMonth() === dateB.getMonth()
            && dateA.getDate() === dateB.getDate();
    }

    const FormatWithCurrentDate = (date: Date, needDay: boolean, needHour: boolean) => {
        const isToday = AreDaysSame(date, currentDate)

        if (isToday)
            return `${needDay ? 'Ma >' : ''} ${FormatPart(date.getHours(), 2, '0')}:${FormatPart(date.getMinutes(), 2, '0')}`
        else
            if (!needDay)
                return `${FormatPart(date.getHours(), 2, '0')}:${FormatPart(date.getMinutes(), 2, '0')}`
            else if (!needHour)
                return `${date.getFullYear()}.${FormatPart(date.getMonth() + 1, 2, '0')}.${FormatPart(date.getDate(), 2, '0')}`
            else
                return `${date.getFullYear()}.${FormatPart(date.getMonth() + 1, 2, '0')}.${FormatPart(date.getDate(), 2, '0')} 
                > ${FormatPart(date.getHours(), 2, '0')}:${FormatPart(date.getMinutes(), 2, '0')}`
    }

    const FormatForCard = (start: Date, end: Date) => {
        // Ha a két nap azonos és ma vannak
        if (AreDaysSame(start, end) && AreDaysSame(start, currentDate))
            return FormatWithCurrentDate(start_date, true, true) + ' - ' + FormatWithCurrentDate(end_date, false, true)
        // Ha a két nap azonos, de nem ma vannak
        if (AreDaysSame(start, end) && !AreDaysSame(start, currentDate))
            return FormatWithCurrentDate(start_date, true, true) + ' - ' + FormatWithCurrentDate(end_date, false, true)
        // Ha a két nap más, de az egyik ma van
        // Ha a két nap más és egyik se ma van
        else
            return FormatWithCurrentDate(start_date, true, false) + ' - ' + FormatWithCurrentDate(end_date, true, false)
    }

    const GetIcon = () => {

        if (eventObj.event_type === 'szorakozas')
            return party_icon
        else if (eventObj.event_type === 'egyetemi')
            return university_icon
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

        var content = document.getElementById('details_' + eventObj.id);
        var card = document.getElementById('card_' + eventObj.id);
        var contents = document.querySelectorAll(".listCard-horizontal-collapsing");

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            contents.forEach((one) => {
                if ((one as HTMLElement) !== content)
                    (one as HTMLElement).style.maxHeight = null;
            });
            content.style.maxHeight = content.scrollHeight + "px";
            dispatch(showToast({ type: "info", message: eventObj.name }));
        }
    }

    return (
        <div className='col-12 cardHolder2'>
            {/* <Link to={"/esemenyek/" + eventObj.id} className="noDeco">
                
            </Link> */}
            <div className='listCard-horizontal' id={'card_' + eventObj.id} onClick={() => { changeContentHeight() }}>
                <div className='row listCard-horizontal-card'>
                    <div className='col-lg-6'>
                        <img className='lC-icon2' src={GetIcon()}></img>
                        <span className='lC-date2'>
                            {FormatForCard(start_date, end_date)}
                        </span>
                    </div>
                    <div className='col-lg-6 lC-name'>
                        {eventObj.name}
                    </div>
                </div>
                <div className='listCard-horizontal-collapsing' id={'details_' + eventObj.id}>
                    yes
                </div>
            </div>
        </div>
    )
}

export default EventCard