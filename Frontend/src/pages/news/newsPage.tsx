import React, { useEffect, useState } from 'react'
import FireBase from '../../components/FireBase'
import { collection, doc, getDoc, getDocs, query, where, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import NewsCard from '../../components/siteSpecific/NewsCard';

const NewsPage = () => {

    const lista = [1, 2, 3, 4, 5];
    const [news, setNews] = useState([]);

    let params = new URLSearchParams(window.location.search);

    useEffect(() => {
        getAllNews();
    }, [window.location.pathname, window.location.search])

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

    return (
        <div className='row'>
            {
                news.map((hir) => <NewsCard newsObj={hir} key={hir.id} />)
            }
        </div>
    )
}

export default NewsPage