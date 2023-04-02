import React, { useEffect, useState } from 'react'
import FireBase from '../../components/FireBase'
import { collection, doc, getDoc, getDocs, query, where, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import NewsCard from '../../components/siteSpecific/NewsCard';
import axios from 'axios';

const NewsPage = () => {

    const lista = [1, 2, 3, 4, 5];
    const [news, setNews] = useState([]);

    let params = new URLSearchParams(window.location.search);

    useEffect(() => {
        getAllNews2();
    }, [window.location.pathname, window.location.search])

    const getAllNews2 = async () => {

        await axios.get('http://localhost:3001/api/hirek/')
            .then(response => {
                setNews(response.data)
            })
            .catch(error => console.log(error));
    }

    const getAllNews = async () => {

        const db = getFirestore();
        const q = query(collection(db, "news"), where("type", "==", params.get("type")), where("isPublic", "==", true));
        const querySnapshot = await getDocs(q);

        var temp = [];

        querySnapshot.forEach((doc) => {
            temp = [...temp, {
                id: doc.id,
                title: doc.get("title"),
                creationDate: doc.get("creationDate"),
                creationID: doc.get("creationID"),
                listIcon: doc.get("listIcon"),
            }];
        });

        setNews(temp);
    }

    let delayPerElement = 100;

    useEffect(() => {
        const boxesElements = document.querySelectorAll(".cardHolder");
        let delay = 300;
        boxesElements.forEach((box) => {
            setTimeout(() => {
                box.classList.add('show');
            }, delay);
            delay += delayPerElement;
        });
    }, [news]);

    return (
        <div id='news-holder'>
            {
                news.map((hir) => <NewsCard newsObj={hir} key={hir._id} />)
            }
        </div>
    )
}

export default NewsPage