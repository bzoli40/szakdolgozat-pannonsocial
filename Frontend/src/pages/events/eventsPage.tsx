import React, { useEffect, useState, Component } from 'react'
import FireBase from '../../components/FireBase'
import { collection, doc, getDoc, getDocs, query, where, getFirestore, orderBy } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import NewsCard from '../../components/siteSpecific/NewsCard';
import EventCard from '../../components/siteSpecific/EventCard';
import axios from 'axios';
import { FormatForCard } from '../../utils/DateFormatting';

//import "../../styles/elements/EventCard";

const EventsPage = () => {

    const lista = [1, 2, 3, 4, 5];
    const [events, setEvents] = useState([]);

    const [eventGroups, setEventGroups] = useState([]);
    const [panelVisible, setPanelVisible] = useState(false);

    const [showingEvent, setShowingEvent] = useState({
        megnevezes: "",
        kezdes: new Date(),
        vege: new Date(),
        oraKell: false,
        helyszin: "",
        leiras: ""
    })

    let params = new URLSearchParams(window.location.search);

    useEffect(() => {
        //getAllNews();
        getAllNews2();
    }, [window.location.pathname, window.location.search])

    const getAllNews2 = async () => {

        await axios.get('http://localhost:3001/api/esemenyek/szures?idorend=true')
            .then(response => {
                setEvents(response.data)
                //console.log(response.data)
            })
            .catch(error => console.log(error));

    }

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
        const groupElements = document.querySelectorAll(".events-month-group");
        const boxesElements = document.querySelectorAll(".cardHolder2");

        let delay = 500;
        let delay2 = delay + 100;

        groupElements.forEach((box) => {

            const latency = box.childNodes[1].childNodes.length * delayPerElement;

            setTimeout(() => {
                box.classList.add('show');
            }, delay);

            delay += delayPerElement + latency;
        });

        boxesElements.forEach((box) => {
            setTimeout(() => {
                box.classList.add('show');
            }, delay2);
            delay2 += delayPerElement;
        });
    }, [eventGroups]);

    useEffect(() => {

        const honapNevek = ["január", "február", "március", "április", "május",
            "június", "július", "augusztus", "szeptember", "október", "november",
            "december"]

        const temp = []

        for (let x = 0; x < events.length; x++) {
            const date = new Date(events[x].kezdes);
            const year = date.getFullYear();
            const month = honapNevek[date.getMonth()];

            let found = false;

            temp.forEach(element => {
                if (element.year === year && element.month === month) {
                    element.events.push(events[x]);
                    found = true;
                }
            });

            if (!found) {
                temp.push({
                    year,
                    month,
                    events: []
                })
                temp[temp.length - 1].events.push(events[x]);
            }
        }

        //console.log(temp)

        setEventGroups(temp);
    }, [events]);

    const showEventDetails = (eventObj) => {
        setShowingEvent(eventObj)

        console.log(eventObj.kezdes)

        setPanelVisible(true)
    }

    const renderBoxes = (input) => input.map((event) => {
        return (
            <div onClick={() => showEventDetails(event)} key={event._id}>
                <EventCard eventObj={event} />
            </div>
        );
    });

    const renderGroupBoxes = eventGroups.map((group) => {
        return (
            <div className='events-month-group' key={group.year + "." + group.month}>
                <div className='events-month-name'>
                    {group.year}. {group.month}
                </div>
                <div className='events-holder'>
                    {renderBoxes(group.events)}
                </div>
            </div>
        );
    });

    const onClickButton = (isTrue) => {
        setPanelVisible(isTrue)
    }

    return (
        <div>
            {/* <div className='events-holder'>
                {renderBoxes(events)}
            </div> */}
            {renderGroupBoxes}
            {
                panelVisible ?
                    <div>
                        <div className='shadow-background z-600' onClick={() => { onClickButton(false) }}>
                        </div>
                        <div id='event-inspection-panel'>
                            <button className='close-button' onClick={() => { onClickButton(false) }}>✖</button>
                            <p className='panel-header'>
                                {showingEvent?.megnevezes}
                            </p>
                            <p className='panel-text-info'>
                                Időpont: {FormatForCard(new Date(showingEvent.kezdes), new Date(showingEvent.vege), new Date(), showingEvent.oraKell)}
                            </p>
                            <p className='panel-text-info'>
                                Helyszín: {showingEvent?.helyszin}
                            </p>
                            <p className='panel-text-detail'>
                                {showingEvent?.leiras}
                            </p>
                        </div>
                    </div> : []
            }
        </div>
    )
}

export default EventsPage