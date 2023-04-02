import { Timestamp } from 'firebase/firestore';
import React from 'react'
import no_icon from './../../images/no_icon_image.png'
import test_icon from './../../images/699345047996ceb8ecabb23948f086c8.jpg'
import { Link } from 'react-router-dom';
import { FormatPart, OneDayFormatWithTodayCheck } from '../../utils/DateFormatting';

function NewsCard({ newsObj }) {

    const creationDate = new Date(newsObj.letrehozva);

    return (
        <div className='cardHolder'>
            <Link to={"/hirek/" + newsObj.hirID} className="noDeco">
                <div className='listCard'>
                    <div className='lC-icon'>
                        <img src={newsObj?.listaKepURL ? newsObj.listaKepURL : no_icon} />
                    </div>
                    <div className='lC-title'>
                        {newsObj.cim}
                    </div>
                    <div className='lC-date'>
                        {
                            newsObj?.iro_szervezete ? `${newsObj.iro_szervezete} - ` : ""
                        }
                        {OneDayFormatWithTodayCheck(creationDate)}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default NewsCard