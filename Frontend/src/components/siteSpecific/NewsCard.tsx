import { Timestamp } from 'firebase/firestore';
import React from 'react'
import no_icon from './../../images/no_icon_image.png'
import test_icon from './../../images/699345047996ceb8ecabb23948f086c8.jpg'
import { Link } from 'react-router-dom';

function NewsCard({ newsObj }) {

    const creationDate = newsObj.creationDate.toDate() as Date;
    const currentDate = new Date();

    const isToday = creationDate.getFullYear() === currentDate.getFullYear()
        && creationDate.getMonth() === currentDate.getMonth()
        && creationDate.getDate() === currentDate.getDate();


    const FormatPart = (input, toCharLength, fillupChar) => {

        var charDifference = toCharLength - input.toString().length;
        var bonus = "";

        for (let x = 0; x < charDifference; x++)
            bonus += fillupChar;

        return bonus + input + "";

    }

    return (
        <div className='col-lg-3 col-12 cardHolder'>
            <Link to={"/hirek/" + newsObj.creationID} className="noDeco">
                <div className='listCard'>
                    <div className='lC-icon'>
                        <img src={newsObj?.listIcon ? newsObj.listIcon : no_icon} />
                    </div>
                    <div className='lC-title'>
                        {newsObj.title}
                    </div>
                    <div className='lC-date'>
                        {isToday ? `Ma - ${FormatPart(creationDate.getHours(), 2, '0')}:${FormatPart(creationDate.getMinutes(), 2, '0')}`
                            : `${creationDate.getFullYear()}.${FormatPart(creationDate.getMonth() + 1, 2, '0')}.${FormatPart(creationDate.getDate(), 2, '0')}`}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default NewsCard