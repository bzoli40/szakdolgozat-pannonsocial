import React, { useEffect, useState } from 'react'
import FireBase from '../../components/FireBase'
import { collection, doc, getDoc, getDocs, query, where, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import NewsCard from '../../components/siteSpecific/NewsCard';
import axios from 'axios';

const NewsPage = () => {

    let params = new URLSearchParams(window.location.search);

    const [news, setNews] = useState([]);
    const [APICallString, setAPICallString] = useState(`http://localhost:3001/api/hirek/szures?tipus=${params.get("tipus")}`);
    const [APICallParams, setAPICallParams] = useState('');

    useEffect(() => {
        if (params.get('esemeny') != null) {
            setAPICallString(`http://localhost:3001/api/hirek/szures?esemeny=${params.get("esemeny")}`)
        }
        else {
            setAPICallString(`http://localhost:3001/api/hirek/szures?tipus=${params.get("tipus")}`)
        }
    }, [window.location.pathname, window.location.search])

    useEffect(() => {
        getAllNews2(`${APICallString}${APICallParams}`);
    }, [APICallString, APICallParams])

    const getAllNews2 = async (backendAPI: string) => {

        console.log(backendAPI)

        await axios.get(backendAPI)
            .then(response => {
                setNews(response.data)
            })
            .catch(error => console.log(error));
    }

    const [searchParams, setSearchParams] = useState({
        kifejezes: '',
        szerzo: '',
        megjelenes_tol: '',
        megjelenes_ig: ''
    })

    useEffect(() => {

        let callParams = ``;
        let paramsString = [];

        if (searchParams.kifejezes.length >= 3)
            paramsString.push(`kifejezes=${searchParams.kifejezes}`)
        if (searchParams.szerzo.length >= 3)
            paramsString.push(`szerzo=${searchParams.szerzo}`)
        if (searchParams.megjelenes_tol != '' && searchParams.megjelenes_ig != '') {
            paramsString.push(`megjelenes_tol=${searchParams.megjelenes_tol}T00:00:00`)
            paramsString.push(`megjelenes_ig=${searchParams.megjelenes_ig}T23:59:59`)
        }

        if (paramsString.length > 0)
            callParams += '&' + paramsString.join('&')

        console.log(callParams)
        if (APICallParams !== callParams) {
            console.log('Új lekérés!')
            setAPICallParams(callParams)
        }

    }, [searchParams])

    const showSearchedNews = (event) => {

        let splittedID = (event.target.id).split('-')
        let id = splittedID[2];
        let value = event.target.value;

        setSearchParams({
            ...searchParams,
            [id]: value
        })
    };

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
        <div>
            {
                params.get("tipus") !== null ?
                    <div id='editor-linked-object'>
                        <div className='title-text'>
                            Szűrés
                        </div>
                        <div className='editor-props'>
                            <div className='editor-prop-duo'>
                                <div className='editor-prop-name'>
                                    Cím
                                </div>
                                <input type="text" placeholder='Legalább 3 karaktert be kell írni a kereséshez' value={searchParams.kifejezes} className="editor-prop-input" id='search-input-kifejezes' onChange={showSearchedNews} />
                            </div>
                            <div className='editor-prop-duo'>
                                <div className='editor-prop-name'>
                                    Szervezet
                                </div>
                                <input type="text" placeholder='Legalább 3 karaktert be kell írni a kereséshez' value={searchParams.szerzo} className="editor-prop-input" id='search-input-szerzo' onChange={showSearchedNews} />
                            </div>
                            <div className='editor-prop-duo'>
                                <div className='editor-prop-name'>
                                    Megjelenés
                                </div>
                                <div className='editor-prop-input-multiple-date'>
                                    <input type="date" id='search-input-megjelenes_tol' value={searchParams.megjelenes_tol} onChange={showSearchedNews} />
                                    -
                                    <input type="date" id='search-input-megjelenes_ig' value={searchParams.megjelenes_ig} onChange={showSearchedNews} />
                                </div>
                            </div>
                        </div>
                    </div>
                    : []
            }

            <div id='news-holder' className={params.get("esemeny") !== null ? 'more-padding' : ''}>
                {
                    news.map((hir) => <NewsCard newsObj={hir} key={hir._id} />)
                }
            </div>
        </div>
    )
}

export default NewsPage