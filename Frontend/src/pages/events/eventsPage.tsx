import React, { useEffect, useState, Component } from 'react'
import FireBase from '../../components/FireBase'
import { collection, doc, getDoc, getDocs, query, where, getFirestore, orderBy } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import NewsCard from '../../components/siteSpecific/NewsCard';
import EventCard from '../../components/siteSpecific/EventCard';

//import "../../styles/elements/EventCard";

const EventsPage = () => {

    const lista = [1, 2, 3, 4, 5];
    const [events, setEvents] = useState([]);

    let params = new URLSearchParams(window.location.search);

    useEffect(() => {
        getAllNews();
    }, [window.location.pathname, window.location.search])

    const getAllNews = async () => {

        const db = getFirestore();
        const q = query(collection(db, "events"), orderBy('start_date'));
        const querySnapshot = await getDocs(q);

        var temp = [];

        querySnapshot.forEach((doc) => {
            temp = [...temp, {
                id: doc.id,
                name: doc.get("name"),
                start_date: doc.get("start_date"),
                end_date: doc.get("end_date"),
                hour_require: doc.get("hour_require"),
                event_type: doc.get("type"),
            }];
        });

        setEvents(temp);
    }

    let delayPerElement = 150;

    useEffect(() => {
        const boxesElements = document.querySelectorAll(".cardHolder2");
        let delay = 500;
        boxesElements.forEach((box) => {
            setTimeout(() => {
                box.classList.add('show');
            }, delay);
            delay += delayPerElement;
        });
    }, [events]);

    const renderBoxes = events.map((event) => {
        return (
            <EventCard eventObj={event} key={event.id} />
        );
    });

    return (
        <div className='row list'>
            {renderBoxes}
        </div>
    )
}

export default EventsPage